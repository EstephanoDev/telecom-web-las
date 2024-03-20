import { fetchForms } from "@/lib/data";
import { Formularios } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useGetForms(ubi: string | undefined, filter: string | undefined) {
  const { data, error } = useQuery({
    queryFn: async () => fetchForms(ubi, filter),
    queryKey: ['Forms']
  });

  // Manejar la posibilidad de que data sea undefined y retornar un array vacío en ese caso
  const formData: Formularios[] = data || [];

  return { formData, error };
}
