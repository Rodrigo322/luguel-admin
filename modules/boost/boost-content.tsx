"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { createBoostSchema, type CreateBoostSchema } from "@/schemas/boost-schemas";
import { useBoostList, useCreateBoost } from "@/modules/boost/queries";
import { toErrorMessage } from "@/lib/http-errors";
import { formatCurrency } from "@/lib/utils";

export function BoostContent() {
  const boostListQuery = useBoostList();
  const createBoostMutation = useCreateBoost();

  const form = useForm<CreateBoostSchema>({
    resolver: zodResolver(createBoostSchema),
    defaultValues: {
      listingId: "",
      amount: 0,
      days: 7,
      paymentConfirmed: true
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createBoostMutation.mutateAsync(values);
    form.reset({
      listingId: "",
      amount: 0,
      days: 7,
      paymentConfirmed: true
    });
  });

  return (
    <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="mb-3 text-2xl font-semibold">Create New Boost</h2>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-shell-foreground-dim">Listing ID</label>
            <Input placeholder="UUID do anuncio" {...form.register("listingId")} />
            {form.formState.errors.listingId && (
              <p className="mt-1 text-xs text-danger">{form.formState.errors.listingId.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-shell-foreground-dim">Valor</label>
            <Input type="number" step="0.01" {...form.register("amount", { valueAsNumber: true })} />
            {form.formState.errors.amount && (
              <p className="mt-1 text-xs text-danger">{form.formState.errors.amount.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-shell-foreground-dim">Dias</label>
            <Input type="number" {...form.register("days", { valueAsNumber: true })} />
            {form.formState.errors.days && <p className="mt-1 text-xs text-danger">{form.formState.errors.days.message}</p>}
          </div>
          <label className="flex items-center gap-2 text-sm text-shell-foreground-dim">
            <input type="checkbox" {...form.register("paymentConfirmed")} className="h-4 w-4 rounded border-border-subtle" />
            Pagamento confirmado
          </label>
          <Button type="submit" className="w-full" loading={createBoostMutation.isPending}>
            Criar impulsionamento
          </Button>
          {createBoostMutation.isError && <ErrorState message={toErrorMessage(createBoostMutation.error)} />}
        </form>
      </Card>

      <Card>
        <h2 className="mb-3 text-2xl font-semibold">Current Boost Campaigns</h2>
        {boostListQuery.isLoading && <LoadingState label="Carregando impulsionamentos..." />}
        {boostListQuery.isError && <ErrorState message={toErrorMessage(boostListQuery.error)} />}
        {!boostListQuery.isLoading && !boostListQuery.isError && (boostListQuery.data?.length ?? 0) === 0 && (
          <EmptyState title="Sem impulsionamentos ativos" description="Crie um novo boost para iniciar campanhas." />
        )}
        {!boostListQuery.isLoading && !boostListQuery.isError && boostListQuery.data && boostListQuery.data.length > 0 && (
          <div className="space-y-2">
            {boostListQuery.data.map((boost) => (
              <div key={boost.id} className="rounded-xl border border-border-subtle bg-shell-muted/55 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-semibold">{boost.listingId}</p>
                  <Badge label={boost.status} tone={boost.status === "ACTIVE" ? "success" : "default"} />
                </div>
                <p className="text-sm text-shell-foreground-dim">{formatCurrency(boost.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
