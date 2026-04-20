"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pricesApi } from "@/libs/api";
import type { Price, CreatePriceDto } from "@/types/api.types";
import { Button } from "@/components/common/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Input } from "@/components/common/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/Form";
import { Plus, Pencil, Trash2, Loader2, Check, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Separator } from "@/components/common/Seperator";
import { Skeleton } from "@/components/common/Skeleton";

type PriceFormValues = {
  title: string;
  description: string;
  priceFrom?: number;
  durationDays?: number;
  features: string[];
  isPopular?: boolean;
};

export function PricesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [priceToDelete, setPriceToDelete] = useState<Price | null>(null);
  const [features, setFeatures] = useState<string[]>([""]);
  const queryClient = useQueryClient();

  const { data: prices, isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: () => pricesApi.findAll(),
  });

  const form = useForm<PriceFormValues>({
    defaultValues: {
      title: "",
      description: "",
      priceFrom: undefined,
      durationDays: undefined,
      features: [],
      isPopular: false,
    },
  });

  useEffect(() => {
    if (editingPrice) {
      form.reset({
        title: editingPrice.title,
        description: editingPrice.description,
        priceFrom: editingPrice.priceFrom,
        durationDays: editingPrice.durationDays,
        features: editingPrice.features || [],
        isPopular: editingPrice.isPopular || false,
      });
    }
  }, [editingPrice, form]);

  const handleEdit = (price: Price) => {
    setEditingPrice(price);
    setFeatures(price.features?.length ? price.features : [""]);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingPrice(null);
    setFeatures([""]);
    form.reset({
      title: "",
      description: "",
      priceFrom: undefined,
      durationDays: undefined,
      features: [],
      isPopular: false,
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreatePriceDto) => pricesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      toast.success("Услуга создана успешно!");
      handleCloseDialog();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при создании услуги";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; dto: CreatePriceDto }) =>
      pricesApi.update(data.id, data.dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      toast.success("Услуга обновлена успешно!");
      handleCloseDialog();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при обновлении услуги";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pricesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      toast.success("Услуга удалена успешно!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при удалении услуги";
      toast.error(message);
    },
  });

  const onSubmit = (data: PriceFormValues) => {
    if (
      data.priceFrom === undefined ||
      data.durationDays === undefined ||
      data.priceFrom < 0 ||
      data.durationDays <= 0
    ) {
      toast.error("Укажите корректные цену и срок в днях");
      return;
    }

    const filteredFeatures = features.filter((f) => f.trim() !== "");
    const submitData: CreatePriceDto = {
      title: data.title,
      description: data.description,
      priceFrom: Math.trunc(data.priceFrom),
      durationDays: Math.trunc(data.durationDays),
      features: filteredFeatures,
      isPopular: data.isPopular || false,
    };

    if (editingPrice) {
      updateMutation.mutate({
        id: editingPrice.id,
        dto: submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPrice(null);
    setFeatures([""]);
    form.reset();
  };

  const handleDelete = (price: Price) => {
    setPriceToDelete(price);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!priceToDelete) return;
    deleteMutation.mutate(priceToDelete.id);
    setIsDeleteDialogOpen(false);
    setPriceToDelete(null);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border-border/60 rounded-2xl border p-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-4 h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mx-5 mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h2 className="text-center text-xl font-semibold sm:text-2xl">
          Управление услугами
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Добавить услугу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPrice ? "Редактировать услугу" : "Создать услугу"}
              </DialogTitle>
              <DialogDescription>
                Заполните форму для{" "}
                {editingPrice ? "редактирования" : "создания"} услуги
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Название обязательно" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Название услуги" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Описание обязательно" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-25 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                          placeholder="Описание услуги"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceFrom"
                  rules={{
                    required: "Цена обязательна",
                    min: { value: 0, message: "Цена не может быть меньше 0" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Цена от (₸)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          step={1}
                          inputMode="numeric"
                          placeholder="Например: 50000"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === ""
                                ? undefined
                                : Math.trunc(Number(value))
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationDays"
                  rules={{
                    required: "Срок обязателен",
                    min: { value: 1, message: "Срок должен быть больше 0" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Срок выполнения (дни)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          step={1}
                          inputMode="numeric"
                          placeholder="Например: 7"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === ""
                                ? undefined
                                : Math.trunc(Number(value))
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">Популярная услуга</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Особенности услуги</FormLabel>
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Особенность услуги"
                      />
                      {features.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addFeature}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить особенность
                  </Button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCloseDialog}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingPrice ? "Сохранить" : "Создать"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {prices?.map((price) => (
          <Card
            key={price.id}
            className={`group border-border/70 hover:shadow-primary/20 relative flex h-full flex-col overflow-hidden border p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl ${price.isPopular ? "border-primary/60 shadow-primary/15 shadow-xl" : ""}`}
          >
            {price.isPopular && (
              <>
                <div className="bg-primary/20 pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full blur-2xl" />
                <div className="via-primary pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent to-transparent" />
              </>
            )}
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1 flex items-center gap-2 text-lg">
                    {price.title}
                  </CardTitle>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${price.isPopular ? "border-primary/30 bg-primary/15 text-primary shadow-primary/20 shadow-sm" : "border-border bg-muted text-muted-foreground"}`}
                >
                  {price.isPopular ? (
                    <>
                      <Star className="mr-1 h-3.5 w-3.5 animate-pulse fill-current" />
                      Популярная
                    </>
                  ) : (
                    "Стандарт"
                  )}
                </span>
              </div>
              <CardDescription className="text-xs font-bold">
                Срок: {price.durationDays} дн.
              </CardDescription>
              <Separator />
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4 pt-0">
              <div>
                <span className="text-foreground text-2xl font-bold">
                  от {(price.priceFrom ?? 0).toLocaleString("ru-RU")} ₸
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {price.description}
              </p>
              <div className="space-y-2">
                {price.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => handleEdit(price)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDelete(price)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="text-destructive mr-2 h-4 w-4" />
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prices?.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Услуг пока нет</p>
        </div>
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setPriceToDelete(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить услугу?</DialogTitle>
            <DialogDescription>
              {priceToDelete
                ? `Услуга "${priceToDelete.title}" будет удалена без возможности восстановления.`
                : "Эта услуга будет удалена без возможности восстановления."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPriceToDelete(null);
              }}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
