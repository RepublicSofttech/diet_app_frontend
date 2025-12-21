import { http } from "./httpAPI";



export const categoriesApi = {
  getCategories: async (search: any) => {
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
      `/categories/?${params.toString()}`
    );

    return {
      data: data.results,
      pageCount: data.total_pages,
      count: data.count,
    };
  },

  createCategory: async (payload: any) => {

    const { data } = await http.post<any>('/categories/', payload);
    return data;
  },

  getCategoryById: async (id: any) => {

    const { data } = await http.get<any>(`/categories/${id}/`);
    return data;
  },

  updateCategory: async (id: any, payload: any) => {

    const { data } = await http.put<any>(
      `/categories/${id}/`,
      payload
    );
    return data;
  },

  patchCategory: async (id: any, payload: any) => {

    const { data } = await http.patch<any>(
      `/categories/${id}/`,
      payload
    );
    return data;
  },

  deleteCategory: async (id: any) => {

    await http.delete(`/categories/${id}/`);
  },

  approveCategory: async (id: any, payload: any) => {

    const { data } = await http.post<any>(
      `/categories/${id}/approve/`,
      payload
    );
    return data;
  },
};








// export const DUMMY_CATEGORIES = [
//   {
//     id: 1,
//     name: "Fruits",
//     description: "Fresh and seasonal fruits",
//     is_approved: true,
//     created_at: "2025-01-01T10:00:00Z",
//     updated_at: "2025-01-02T10:00:00Z",
//     created_by: 1,
//     approved_by: 99
//   },
//   {
//     id: 2,
//     name: "Vegetables",
//     description: "Leafy greens, roots, and farm vegetables",
//     is_approved: true,
//     created_at: "2025-01-01T11:00:00Z",
//     updated_at: "2025-01-02T11:00:00Z",
//     created_by: 1,
//     approved_by: 99
//   },
//   {
//     id: 3,
//     name: "Dairy",
//     description: "Milk, cheese, butter, and dairy products",
//     is_approved: false,
//     created_at: "2025-01-03T09:00:00Z",
//     updated_at: "2025-01-03T09:00:00Z",
//     created_by: 2,
//     approved_by: null
//   },
//   {
//     id: 4,
//     name: "Bakery",
//     description: "Bread, cakes, pastries, and baked goods",
//     is_approved: true,
//     created_at: "2025-01-04T09:00:00Z",
//     updated_at: "2025-01-04T09:00:00Z",
//     created_by: 1,
//     approved_by: 99
//   },
//   {
//     id: 5,
//     name: "Seafood",
//     description: "Fish, shrimp, crab, and seafood items",
//     is_approved: true,
//     created_at: "2025-01-05T08:30:00Z",
//     updated_at: "2025-01-05T08:30:00Z",
//     created_by: 3,
//     approved_by: 99
//   },
//   {
//     id: 6,
//     name: "Meat",
//     description: "Fresh and frozen red and white meats",
//     is_approved: false,
//     created_at: "2025-01-06T07:45:00Z",
//     updated_at: "2025-01-06T07:45:00Z",
//     created_by: 2,
//     approved_by: null
//   },
//   {
//     id: 7,
//     name: "Beverages",
//     description: "Soft drinks, juices, tea, and coffee",
//     is_approved: true,
//     created_at: "2025-01-07T12:00:00Z",
//     updated_at: "2025-01-07T12:00:00Z",
//     created_by: 1,
//     approved_by: 99
//   },
//   {
//     id: 8,
//     name: "Snacks",
//     description: "Chips, cookies, and ready-to-eat snacks",
//     is_approved: true,
//     created_at: "2025-01-08T14:20:00Z",
//     updated_at: "2025-01-08T14:20:00Z",
//     created_by: 4,
//     approved_by: 99
//   },
//   {
//     id: 9,
//     name: "Frozen Foods",
//     description: "Frozen meals, vegetables, and desserts",
//     is_approved: false,
//     created_at: "2025-01-09T16:10:00Z",
//     updated_at: "2025-01-09T16:10:00Z",
//     created_by: 3,
//     approved_by: null
//   },
//   {
//     id: 10,
//     name: "Spices & Condiments",
//     description: "Herbs, spices, sauces, and seasonings",
//     is_approved: true,
//     created_at: "2025-01-10T18:00:00Z",
//     updated_at: "2025-01-10T18:00:00Z",
//     created_by: 1,
//     approved_by: 99
//   },
//   {
//     id: 11,
//     name: "Organic Foods",
//     description: "Certified organic food products",
//     is_approved: true,
//     created_at: "2025-01-11T09:30:00Z",
//     updated_at: "2025-01-11T09:30:00Z",
//     created_by: 5,
//     approved_by: 99
//   },
//   {
//     id: 12,
//     name: "Canned Goods",
//     description: "Canned vegetables, beans, and soups",
//     is_approved: false,
//     created_at: "2025-01-12T10:45:00Z",
//     updated_at: "2025-01-12T10:45:00Z",
//     created_by: 4,
//     approved_by: null
//   },
//   {
//     id: 13,
//     name: "Breakfast Items",
//     description: "Cereals, oats, spreads, and breakfast foods",
//     is_approved: true,
//     created_at: "2025-01-13T07:15:00Z",
//     updated_at: "2025-01-13T07:15:00Z",
//     created_by: 1,
//     approved_by: 99
//   },
//   {
//     id: 14,
//     name: "Health & Nutrition",
//     description: "Protein, supplements, and healthy foods",
//     is_approved: false,
//     created_at: "2025-01-14T11:40:00Z",
//     updated_at: "2025-01-14T11:40:00Z",
//     created_by: 5,
//     approved_by: null
//   },
//   {
//     id: 15,
//     name: "International Foods",
//     description: "Imported and world cuisine ingredients",
//     is_approved: true,
//     created_at: "2025-01-15T13:55:00Z",
//     updated_at: "2025-01-15T13:55:00Z",
//     created_by: 2,
//     approved_by: 99
//   }
// ];

// export const getCategoriesDummy = async (searchOptions: {
//   page: number;
//   perPage: number;
// }) => {
//   const { page, perPage } = searchOptions;
//     console.log("hello getCategoriesDummy")

//   const start = (page - 1) * perPage;
//   const end = start + perPage;

//   const results = DUMMY_CATEGORIES.slice(start, end);
//   const pageCount = Math.ceil(DUMMY_CATEGORIES.length / perPage);

//   return Promise.resolve({
//     data: {
//       count: DUMMY_CATEGORIES.length,
//       total_pages: pageCount,
//       items_per_page: perPage,
//       next:
//         page < pageCount
//           ? `/categories/?page=${page + 1}&per_page=${perPage}`
//           : null,
//       previous:
//         page > 1
//           ? `/categories/?page=${page - 1}&per_page=${perPage}`
//           : null,
//       results
//     },
//     pageCount
//   });
// };
