import config from 'config';
import { DataResolver } from './types/DataResolver';
import { Order } from '@vue-storefront/core/modules/order/types/Order'
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import Task from '@vue-storefront/core/lib/sync/types/Task'
import getApiEndpointUrl from '@vue-storefront/core/helpers/getApiEndpointUrl';

const placeOrder = (order: Order): Promise<Task> =>
  TaskQueue.execute({ url: getApiEndpointUrl(config.orders, 'endpoint'), // sync the order
    payload: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(order)
    }
  })

export const OrderService: DataResolver.OrderService = {
  placeOrder
}
