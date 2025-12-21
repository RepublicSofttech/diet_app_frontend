// import type { ExtendedColumnFilter, FilterOperator } from "../types/data-table";

// export function buildFilterQueryParams(filters: ExtendedColumnFilter[]): URLSearchParams {
//   const params = new URLSearchParams();

//   filters.forEach(filter => {
//     const key = getFilterParamKey(filter.id, filter.operator);
//     const value = formatFilterValue(filter.value, filter.operator);
//     if (value !== undefined && value !== '') {
//       params.append(key, value);
//     }
//   });

//   return params;
// }

// export function getFilterParamKey(columnId: string, operator: FilterOperator): string {
//   switch (operator) {
//     case 'iLike':
//       return `${columnId}__icontains`;
//     case 'notILike':
//       return `${columnId}__icontains`; // Note: value should be prefixed with ! if needed
//     case 'eq':
//       return columnId;
//     case 'ne':
//       return `${columnId}__ne`;
//     case 'lt':
//       return `${columnId}__lt`;
//     case 'lte':
//       return `${columnId}__lte`;
//     case 'gt':
//       return `${columnId}__gt`;
//     case 'gte':
//       return `${columnId}__gte`;
//     case 'inArray':
//       return `${columnId}__in`;
//     case 'notInArray':
//       return `${columnId}__notin`;
//     case 'isEmpty':
//       return `${columnId}__isnull`;
//     case 'isNotEmpty':
//       return `${columnId}__isnull`;
//     case 'isBetween':
//       // Handle range filters - this might need special handling
//       return columnId;
//     case 'isRelativeToToday':
//       // Handle date relative filters
//       return columnId;
//     default:
//       return columnId;
//   }
// }

// export function formatFilterValue(value: any, operator: FilterOperator): string {
//   if (value === null || value === undefined) {
//     if (operator === 'isEmpty') return 'true';
//     if (operator === 'isNotEmpty') return 'false';
//     return '';
//   }

//   if (operator === 'notILike') {
//     return `!${value}`;
//   }

//   if (Array.isArray(value)) {
//     return value.join(',');
//   }

//   return String(value);
// }

// export function validateFilter(filter: ExtendedColumnFilter): boolean {
//   if (!filter.id || !filter.operator) return false;

//   if (filter.operator === 'isEmpty' || filter.operator === 'isNotEmpty') {
//     return true; // These don't require a value
//   }

//   if (Array.isArray(filter.value)) {
//     return filter.value.length > 0;
//   }

//   return filter.value !== '' && filter.value !== null && filter.value !== undefined;
// }

// export function getValidFilters<TData>(filters: ExtendedColumnFilter<TData>[]): ExtendedColumnFilter<TData>[] {
//   return filters.filter(validateFilter);
// }