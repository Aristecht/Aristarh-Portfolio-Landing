import axios from "axios";
import type {
  Project,
  CreateProjectDto,
  Price,
  CreatePriceDto,
  UpdatePriceDto,
  ProjectStatus,
} from "@/types/api.types";
import type { AdminProfile } from "@/store/auth/auth.types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (!config.baseURL) {
      return Promise.reject(
        new Error(
          "API URL is not configured. Set NEXT_PUBLIC_API_URL to your backend URL."
        )
      );
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth");
      if (token) {
        try {
          const authData = JSON.parse(token);
          if (authData?.state?.accessToken) {
            config.headers.Authorization = `Bearer ${authData.state.accessToken}`;
          }
        } catch (error) {
          console.error(
            "[API] Ошибка при чтении токена из localStorage:",
            error
          );
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        console.log("[API] Получен 401, попытка обновить токен...");
        const response = await api.post("/auth/refresh");
        const { access_token } = response.data;

        if (typeof window !== "undefined" && access_token) {
          const authData = localStorage.getItem("auth");
          if (authData) {
            try {
              const parsed = JSON.parse(authData);
              parsed.state.accessToken = access_token;
              localStorage.setItem("auth", JSON.stringify(parsed));
              console.log("[API] Токен успешно обновлен, повторяем запрос");
            } catch (e) {
              console.error(
                "[API] Ошибка при обновлении токена в localStorage:",
                e
              );
            }
          }
        }

        if (access_token) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth");
          const isAdminRoute =
            window.location.pathname.startsWith("/dashboard");
          if (isAdminRoute && !window.location.pathname.startsWith("/auth")) {
            window.location.replace("/auth/login");
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  refresh: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  profile: async (): Promise<AdminProfile> => {
    // Some backends expose profile as /auth/me or use POST for profile endpoints.
    const candidates: Array<() => Promise<{ data: AdminProfile }>> = [
      () => api.get<AdminProfile>("/auth/profile"),
      () => api.get<AdminProfile>("/auth/me"),
      () => api.post<AdminProfile>("/auth/profile"),
      () => api.post<AdminProfile>("/auth/me"),
    ];

    let lastError: unknown;
    for (const request of candidates) {
      try {
        const response = await request();
        return response.data;
      } catch (error: any) {
        const status = error?.response?.status;

        // Try next candidate only for method/route mismatch errors.
        if (status === 404 || status === 405) {
          lastError = error;
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  },
};

// Projects API
export const projectsApi = {
  findAll: async (status?: ProjectStatus): Promise<Project[]> => {
    const response = await api.get("/projects", {
      params: status ? { status } : {},
    });
    return response.data;
  },

  findOne: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (dto: CreateProjectDto, image?: File): Promise<Project> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    if (dto.description) formData.append("description", dto.description);
    if (dto.status) formData.append("status", dto.status);
    if (dto.siteUrl) formData.append("siteUrl", dto.siteUrl);
    if (dto.tags) {
      formData.append("tags", JSON.stringify(dto.tags));
    }
    if (image) formData.append("image", image);

    const response = await api.post("/projects/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (
    id: string,
    dto: CreateProjectDto,
    image?: File
  ): Promise<Project> => {
    const formData = new FormData();
    formData.append("title", dto.title);
    if (dto.description) formData.append("description", dto.description);
    if (dto.status) formData.append("status", dto.status);
    if (dto.siteUrl) formData.append("siteUrl", dto.siteUrl);
    if (dto.tags) {
      formData.append("tags", JSON.stringify(dto.tags));
    }
    if (image) formData.append("image", image);

    const response = await api.patch(`/projects/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Prices API
export const pricesApi = {
  findAll: async (): Promise<Price[]> => {
    const response = await api.get("/prices");
    return response.data;
  },

  findOne: async (id: string): Promise<Price> => {
    const response = await api.get(`/prices/${id}`);
    return response.data;
  },

  create: async (dto: CreatePriceDto): Promise<Price> => {
    const response = await api.post("/prices", dto);
    return response.data;
  },

  update: async (id: string, dto: UpdatePriceDto): Promise<Price> => {
    const response = await api.put(`/prices/${id}`, dto);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/prices/${id}`);
  },
};
