import { http } from "./httpAPI";

export const healthIssueApi = {
  get: async (search?: any) => {
    const params = new URLSearchParams();

    if (search) {
      // Pagination
      if (search.page != null) {
        params.append('page', search.page.toString());
      }
      if (search.perPage != null) {
        params.append('per_page', search.perPage.toString());
      }

      // Filters
      if (Array.isArray(search.filters)) {
        search.filters.forEach((filter: any) => {
          let paramName = filter.id;
          let paramValue = filter.value;

          switch (filter.operator) {
            case 'iLike':
              paramName += '__icontains';
              break;
            case 'notILike':
              paramName += '__icontains';
              paramValue = `!${paramValue}`;
              break;
            case 'eq':
              break;
            case 'ne':
              paramName += '__ne';
              break;
            case 'lt':
              paramName += '__lt';
              break;
            case 'lte':
              paramName += '__lte';
              break;
            case 'gt':
              paramName += '__gt';
              break;
            case 'gte':
              paramName += '__gte';
              break;
            case 'inArray':
              paramName += '__in';
              paramValue = Array.isArray(paramValue) ? paramValue.join(',') : paramValue;
              break;
            case 'notInArray':
              paramName += '__notin';
              paramValue = Array.isArray(paramValue) ? paramValue.join(',') : paramValue;
              break;
            case 'isEmpty':
              paramName += '__isnull';
              paramValue = 'true';
              break;
            case 'isNotEmpty':
              paramName += '__isnull';
              paramValue = 'false';
              break;
            default:
              break;
          }

          if (paramValue !== undefined && paramValue !== '') {
            params.append(paramName, paramValue);
          }
        });
      }

      // Sorting
      if (Array.isArray(search.sort) && search.sort.length > 0) {
        const ordering = search.sort.map((s: any) => (s.desc ? `-${s.id}` : s.id)).join(',');
        params.append('ordering', ordering);
      }
    }

    const queryString = params.toString();
    const url = queryString ? `/health-issues/?${queryString}` : `/health-issues/`;

    const { data } = await http.get<any>(url);

    return {
      data: data.results,
      pageCount: data.total_pages,
      count: data.count,
    };
  },

  create: async (payload: any) => {
    const { data } = await http.post<any>('/health-issues/', payload);
    return data;
  },

  getById: async (id: any) => {
    const { data } = await http.get<any>(`/health-issues/${id}/`);
    return data;
  },

  update: async (id: any, payload: any) => {
    const { data } = await http.put<any>(`/health-issues/${id}/`, payload);
    return data;
  },

  patch: async (id: any, payload: any) => {
    const { data } = await http.patch<any>(`/health-issues/${id}/`, payload);
    return data;
  },

  delete: async (id: any) => {
    await http.delete(`/health-issues/${id}/`);
  },
};
