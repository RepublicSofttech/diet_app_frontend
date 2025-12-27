import { http } from "./httpAPI";

export const recipeRestrictionApi = {
 get: async (search: any = {}) => {
  const params = new URLSearchParams();

  // Pagination (optional)
  if (search.page != null) {
    params.append('page', search.page.toString());
  }

  if (search.perPage != null) {
    params.append('per_page', search.perPage.toString());
  }

  // Filters (optional)
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
          paramValue = Array.isArray(paramValue)
            ? paramValue.join(',')
            : paramValue;
          break;
        case 'notInArray':
          paramName += '__notin';
          paramValue = Array.isArray(paramValue)
            ? paramValue.join(',')
            : paramValue;
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
        params.append(paramName, String(paramValue));
      }
    });
  }

  // Sorting (optional)
  if (Array.isArray(search.sort) && search.sort.length > 0) {
    const ordering = search.sort
      .map((s: any) => (s.desc ? `-${s.id}` : s.id))
      .join(',');
    params.append('ordering', ordering);
  }

  const queryString = params.toString();
  const url = queryString
    ? `/mapping-health-recipes/?${queryString}`
    : `/mapping-health-recipes/`;

  const { data } = await http.get<any>(url);

  return {
    data: data.results,
    pageCount: data.total_pages,
    count: data.count,
  };
},


  create: async (payload: any) => {

    const { data } = await http.post<any>('/mapping-health-recipes/', payload);
    console.log("@ Data :",data)
    return data;
  },

  getById: async (id: any) => {

    const { data } = await http.get<any>(`/mapping-health-recipes/${id}/`);
    return data;
  },

  update: async (id: any, payload: any) => {

    const { data } = await http.put<any>(
      `/mapping-health-recipes/${id}/`,
      payload
    );
    return data;
  },

  patch: async (id: any, payload: any) => {

    const { data } = await http.patch<any>(
      `/mapping-health-recipes/${id}/`,
      payload
    );
    return data;
  },

  delete: async (id: any) => {

    await http.delete(`/mapping-health-recipes/${id}/`);
  },

  approve: async (id: any, payload: any) => {

    const { data } = await http.post<any>(
      `/mapping-health-recipes/${id}/approve/`,
      payload
    );
    return data;
  },
  uploadImage : async (id: any, payload: any) => {

    const { data } = await http.post<any>(
      `/mapping-health-recipes/${id}/upload-image/`,
      payload,
      {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
    );
    return data;
  },
};
