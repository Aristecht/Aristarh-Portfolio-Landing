"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/libs/api";
import type {
  Project,
  CreateProjectDto,
  ProjectStatus,
} from "@/types/api.types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Separator } from "@/components/common/Seperator";
import { Skeleton } from "@/components/common/Skeleton";

export function ProjectsManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.findAll(),
  });

  const form = useForm<CreateProjectDto>({
    defaultValues: {
      title: "",
      description: "",
      status: "DRAFT" as ProjectStatus,
      siteUrl: "",
      tags: [],
    },
  });

  const getImageSrc = (imageUrl?: string) => {
    if (!imageUrl) return "";
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    try {
      const parsedApiUrl = new URL(rawApiUrl);
      const apiOrigin = parsedApiUrl.origin;
      const apiPath = parsedApiUrl.pathname.replace(/\/+$/, "");
      const normalizedImagePath = imageUrl.replace(/^\/+/, "");

      if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        const absoluteImageUrl = new URL(imageUrl);
        const isLocalhostImage =
          absoluteImageUrl.hostname === "localhost" ||
          absoluteImageUrl.hostname === "127.0.0.1";

        if (!isLocalhostImage) {
          return imageUrl;
        }

        const normalizedAbsolutePath = absoluteImageUrl.pathname
          .replace(/^\/+/, "")
          .replace(/^api\//, "");
        return `${apiOrigin}/${normalizedAbsolutePath}`;
      }

      if (normalizedImagePath.startsWith("uploads/")) {
        return `${apiOrigin}/${normalizedImagePath}`;
      }

      if (normalizedImagePath.startsWith("api/uploads/")) {
        return `${apiOrigin}/${normalizedImagePath.replace(/^api\//, "")}`;
      }

      if (apiPath && apiPath !== "/") {
        const normalizedApiPath = apiPath.replace(/^\/+/, "");
        if (normalizedImagePath.startsWith(`${normalizedApiPath}/`)) {
          return `${apiOrigin}/${normalizedImagePath}`;
        }

        return `${apiOrigin}${apiPath}/${normalizedImagePath}`;
      }

      return `${apiOrigin}/${normalizedImagePath}`;
    } catch {
      return imageUrl;
    }
  };

  const getStatusMeta = (status: ProjectStatus) => {
    if (status === "DONE") {
      return {
        label: "Завершен",
        className:
          "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
      };
    }

    if (status === "IN_PROGRESS") {
      return {
        label: "В работе",
        className: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
      };
    }

    return {
      label: "Черновик",
      className: "bg-muted text-muted-foreground border border-border",
    };
  };

  const getProjectTimeline = (project: Project) => {
    const startDate = new Date(project.createdAt);

    if (project.status === "DONE") {
      const endDate = new Date(project.updatedAt);
      const diffMs = endDate.getTime() - startDate.getTime();
      const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      return `Срок выполнения: ${days} дн.`;
    }

    if (project.status === "IN_PROGRESS") {
      return `Старт: ${startDate.toLocaleDateString("ru-RU")}`;
    }

    return `Создан: ${startDate.toLocaleDateString("ru-RU")}`;
  };

  useEffect(() => {
    if (editingProject) {
      form.reset({
        title: editingProject.title,
        description: editingProject.description || "",
        status: editingProject.status,
        siteUrl: editingProject.siteUrl || "",
        tags: editingProject.tags || [],
      });
    }
  }, [editingProject, form]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTags(project.tags?.length ? project.tags : [""]);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setSelectedImage(null);
    setTags([""]);
    form.reset({
      title: "",
      description: "",
      status: "DRAFT" as ProjectStatus,
      siteUrl: "",
      tags: [],
    });
  };

  const createMutation = useMutation({
    mutationFn: (data: { dto: CreateProjectDto; image?: File }) =>
      projectsApi.create(data.dto, data.image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Проект создан успешно!");
      handleCloseDialog();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при создании проекта";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; dto: CreateProjectDto; image?: File }) =>
      projectsApi.update(data.id, data.dto, data.image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Проект обновлен успешно!");
      handleCloseDialog();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при обновлении проекта";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Проект удален успешно!");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Ошибка при удалении проекта";
      toast.error(message);
    },
  });

  const onSubmit = (data: CreateProjectDto) => {
    const filteredTags = tags.filter((t) => t.trim() !== "");
    const submitData = { ...data, tags: filteredTags };

    if (editingProject) {
      updateMutation.mutate({
        id: editingProject.id,
        dto: submitData,
        image: selectedImage || undefined,
      });
    } else {
      createMutation.mutate({
        dto: submitData,
        image: selectedImage || undefined,
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setSelectedImage(null);
    setTags([""]);
    form.reset();
  };

  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    deleteMutation.mutate(projectToDelete.id);
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border-border/60 rounded-2xl border p-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="mt-4 h-5 w-2/3" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mx-5 mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h2 className="text-center text-xl font-semibold sm:text-2xl">
          Управление проектами
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Добавить проект
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Редактировать проект" : "Создать проект"}
              </DialogTitle>
              <DialogDescription>
                Заполните форму для{" "}
                {editingProject ? "редактирования" : "создания"} проекта
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
                        <Input {...field} placeholder="Название проекта" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-25 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                          placeholder="Описание проекта"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Статус</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Черновик</SelectItem>
                          <SelectItem value="IN_PROGRESS">В работе</SelectItem>
                          <SelectItem value="DONE">Завершен</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="siteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на сайт</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Теги / Технологии</FormLabel>
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...tags];
                          newTags[index] = e.target.value;
                          setTags(newTags);
                        }}
                        placeholder="Например: React, Next.js"
                      />
                      {tags.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          className="hover:translate-y-0"
                          size="sm"
                          onClick={() => {
                            const newTags = tags.filter((_, i) => i !== index);
                            setTags(newTags);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTags([...tags, ""])}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить тег
                  </Button>
                </div>

                <div className="space-y-2">
                  <FormLabel>Изображение</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setSelectedImage(e.target.files?.[0] || null)
                    }
                  />
                  {editingProject?.imageUrl && !selectedImage && (
                    <div className="relative h-32 w-full overflow-hidden rounded-xl border">
                      <Image
                        src={getImageSrc(editingProject.imageUrl)}
                        alt={editingProject.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="object-cover"
                      />
                    </div>
                  )}
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
                    {editingProject ? "Сохранить" : "Создать"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {projects?.map((project) => (
          <Card
            key={project.id}
            className="group border-border/70 hover:shadow-primary/20 flex h-full flex-col overflow-hidden border p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            {project.imageUrl && (
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <Image
                  src={getImageSrc(project.imageUrl)}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
              </div>
            )}
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1 text-lg">
                    {project.title}
                  </CardTitle>
                </div>
                <span
                  className={`${getStatusMeta(project.status).className} inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium`}
                >
                  {getStatusMeta(project.status).label}
                </span>
              </div>
              <CardDescription className="text-xs font-bold">
                {getProjectTimeline(project)}
              </CardDescription>
              <Separator />
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4 pt-0">
              <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                {project.description || "Описание не указано"}
              </p>
              {project.tags && project.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto space-y-2 pt-2">
                {project.siteUrl && (
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <a
                      href={project.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Открыть сайт
                    </a>
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => handleEdit(project)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Редактировать
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDelete(project)}
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

      {projects?.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Проектов пока нет</p>
        </div>
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setProjectToDelete(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить проект?</DialogTitle>
            <DialogDescription>
              {projectToDelete
                ? `Проект "${projectToDelete.title}" будет удален без возможности восстановления.`
                : "Этот проект будет удален без возможности восстановления."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setProjectToDelete(null);
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
