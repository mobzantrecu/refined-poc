import axios, { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { match } from "ts-pattern";
import {
  DataProvider,
  HttpError,
  CrudOperators,
  CrudFilters,
  CrudSorting,
  BaseKey,
  CrudFilter,
  GetManyResponse,
  GetListResponse,
} from "@pankod/refine-core";
//import warnOnce from "warn-once";
import {
  IDataContextProvider,
  MetaDataQuery,
  Pagination,
  BaseRecord,
} from "@pankod/refine-core/dist/interfaces";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

/**
 * TODO: *tests*
 **/


/**
 *
 *
 * @see {@link https://github.com/jhipster/jhipster-bom/tree/main/jhipster-framework/src/main/java/tech/jhipster/service/filter| JHipster's filters code}
 */
enum JHipsterCrudOperators {
  "EQUALS" = "equals",
  "NOT_EQUALS" = "notEquals",
  "SPECIFIED" = "specified",
  "IN" = "in",
  "NOT_IN" = "notIn",
  "CONTAINS" = "contains",
  "DOES_NOT_CONTAIN" = "doesNotContain",
  "GREATER_THAN" = "greaterThan",
  "LESS_THAN" = "lessThan",
  "GREATER_THAN_OR_EQUAL" = "greaterThanOrEqual",
  "LESS_THAN_OR_EQUAL" = "lessThanOrEqual",
}

const mapOperator = (operator: CrudOperators): string => {
  const op = match(operator)
    .with("eq", () => JHipsterCrudOperators.EQUALS)
    .with("ne", () => JHipsterCrudOperators.NOT_EQUALS)
    .with("null", () => JHipsterCrudOperators.SPECIFIED)
    .with("nnull", () => JHipsterCrudOperators.SPECIFIED)
    .with("in", () => JHipsterCrudOperators.IN)
    .with("nin", () => JHipsterCrudOperators.NOT_IN)
    .with("contains", () => JHipsterCrudOperators.CONTAINS)
    .with("ncontains", () => JHipsterCrudOperators.DOES_NOT_CONTAIN)
    .with("gt", () => JHipsterCrudOperators.GREATER_THAN)
    .with("gte", () => JHipsterCrudOperators.GREATER_THAN_OR_EQUAL)
    .with("lt", () => JHipsterCrudOperators.LESS_THAN)
    .with("lte", () => JHipsterCrudOperators.LESS_THAN_OR_EQUAL)
    .otherwise((notSupportedOperator) => {
      throw Error(`Operator ${notSupportedOperator} is not supported`);
    });

  return `${op}`;
};

const generateSort = (sort?: CrudSorting) => {
  if (sort && sort.length > 0) {
    const _sort: string[] = [];
    const _order: string[] = [];

    sort.map((item) => {
      _sort.push(item.field);
      _order.push(item.order);
    });

    return {
      _sort,
      _order,
    };
  }

  return;
};

const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};

  if (filters) {
    filters.map((filter) => {
      if ("field" in filter) {
        const { field, operator, value } = filter;

        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}.${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};

class JHipsterDataProvider implements IDataContextProvider {
  private apiUrl: Required<string>;
  private httpClient: Required<AxiosInstance>;

  constructor(apiUrl: string, httpClient: AxiosInstance = axiosInstance) {
    this.apiUrl = apiUrl;
    this.httpClient = httpClient;
  }

  getApiUrl() {
    return this.apiUrl;
  }

  async getOne(params: {
    resource: string;
    id: BaseKey;
    metaData?: MetaDataQuery;
  }) {
    const { data } = await this.httpClient.get(
      `${this.apiUrl}/${params.resource}/${params.id}`
    );

    return {
      data,
    };
  }

  async getList<TData extends BaseRecord = BaseRecord>(
    params: {
      resource: string;
      pagination?: Pagination;
      hasPagination?: boolean;
      sort?: CrudSorting;
      filters?: CrudFilters;
      metaData?: MetaDataQuery;
      dataProviderName?: string;
    } = {
      hasPagination: true,
      pagination: { current: 1, pageSize: 10 },
      resource: "",
    }
  ): Promise<GetListResponse<TData>> {
    const url = `${this.apiUrl}/${params.resource}`;

    const { current = 1, pageSize = 10 } = params.pagination ?? {};

    const queryFilters = generateFilter(params.filters);

    const query: {
      _start?: number;
      _end?: number;
      _sort?: string;
      _order?: string;
    } = params.hasPagination
      ? {
          _start: (current - 1) * pageSize,
          _end: current * pageSize,
        }
      : {};

    const generatedSort = generateSort(params.sort);
    if (generatedSort) {
      const { _sort, _order } = generatedSort;
      query._sort = _sort.join(",");
      query._order = _order.join(",");
    }

    const { data, headers } = await this.httpClient.get(
      `${url}?${stringify(query)}&${stringify(queryFilters)}`
    );

    const total = +(headers["x-total-count"] ?? Number.NaN);

    return {
      data,
      total,
    };
  }

  async getMany<TData extends BaseRecord = BaseRecord>(params: {
    resource: string;
    ids: BaseKey[];
    metaData?: MetaDataQuery;
    dataProviderName?: string;
  }): Promise<GetManyResponse<TData>> {
    const idsInFilter: CrudFilter = {
      field: "id",
      operator: "in",
      value: params.ids,
    };
    const queryFilters = generateFilter([idsInFilter]);

    const { data } = await this.httpClient.get(
      `${this.apiUrl}/${params.resource}?${stringify(queryFilters)}`
    );

    return {
      data,
    };
  }

  async create<TVariables = {}>(params: {
    resource: string;
    variables: TVariables;
    metaData?: MetaDataQuery;
  }) {
    const url = `${this.apiUrl}/${params.resource}`;

    const { data } = await this.httpClient.post(url, params.variables);

    return {
      data,
    };
  }

  async update<TVariables = {}>(params: {
    resource: string;
    id: BaseKey;
    variables: TVariables;
    metaData?: MetaDataQuery;
  }) {
    const url = `${this.apiUrl}/${params.resource}/${params.id}`;

    const { data } = await this.httpClient.put(url, params.variables);

    return {
      data,
    };
  }

  async deleteOne<TVariables = {}>(params: {
    resource: string;
    id: BaseKey;
    variables?: TVariables;
    metaData?: MetaDataQuery;
  }) {
    const url = `${this.apiUrl}/${params.resource}/${params.id}`;

    const { data } = await this.httpClient.delete(url, {
      data: params.variables,
    });

    return {
      data,
    };
  }
}

const JHipsterServer = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany" | "custom"
> => {
  const jhipsterDataProvider = new JHipsterDataProvider(apiUrl, httpClient);
  return {
    create: (params) => jhipsterDataProvider.create(params),
    deleteOne: jhipsterDataProvider.deleteOne,
    getApiUrl: jhipsterDataProvider.getApiUrl,
    getList: (params) => jhipsterDataProvider.getList(params),
    getMany: jhipsterDataProvider.getMany,
    getOne: jhipsterDataProvider.getOne,
    update: jhipsterDataProvider.update,
  };
};

export default JHipsterServer;
