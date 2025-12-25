import { http } from "./httpAPI";

export const ingredientsApi = {
  get: async (search: any) => {
    console.log(search)
    const params = new URLSearchParams({
      page: search.page.toString(),
      per_page: search.perPage.toString(),
    });

    // Add filters
    if (search.filters && Array.isArray(search.filters)) {
      search.filters.forEach((filter: any) => {
        let paramName = filter.id;
        let paramValue = filter.value;

        switch (filter.operator) {
          case 'iLike':
            paramName += '__icontains';
            break;
          case 'notILike':
            paramName += '__icontains';
            paramValue = `!${paramValue}`; // Assuming backend handles negation
            break;
          case 'eq':
            // exact match
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
          // Add more cases as needed
          default:
            break;
        }

        if (paramValue !== undefined && paramValue !== '') {
          params.append(paramName, paramValue);
        }
      });
    }

    // Add sorting
    if (search.sort && Array.isArray(search.sort)) {
      const ordering = search.sort.map((s: any) => (s.desc ? `-${s.id}` : s.id)).join(',');
      params.append('ordering', ordering);
    }

    const { data } = await http.get<any>(
      `/ingredients/?${params.toString()}`
    );

    return {
      data: data.results,
      pageCount: data.total_pages,
      count: data.count,
    };
  },

  create: async (payload: any) => {

    const { data } = await http.post<any>('/ingredients/', payload);
    console.log("@ Data :",data)
    return data;
  },

  getById: async (id: any) => {

    const { data } = await http.get<any>(`/ingredients/${id}/`);
    return data;
  },

  update: async (id: any, payload: any) => {

    const { data } = await http.put<any>(
      `/ingredients/${id}/`,
      payload
    );
    return data;
  },

  patch: async (id: any, payload: any) => {

    const { data } = await http.patch<any>(
      `/ingredients/${id}/`,
      payload
    );
    return data;
  },

  delete: async (id: any) => {

    await http.delete(`/ingredients/${id}/`);
  }
};
