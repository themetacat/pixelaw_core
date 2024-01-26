import { useDojo } from '@/DojoContext'
import { useQuery } from '@tanstack/react-query'
import { removeNullsFromArray } from '../../global/utils'
import { parseEventData } from './utils'

const ALERTS_TO_GET = 1_000

const useAlerts = () => {
  const {
    setup: {
      network: { graphSdk },
    },
    account: {
      account
    }
  } = useDojo()

  return useQuery({
    queryKey: ['alerts', account.address.toLowerCase()],
    queryFn: async () => {
      /// TODO: paginate getting alerts. Settling for this right now
      const {data} = await graphSdk.alerts({ first: ALERTS_TO_GET })
      return (data.events?.edges ?? [])
        .filter(edge => {
          if (!edge?.node?.data) return false
          const player = edge.node.data[3]
          return player?.toLowerCase() === account.address.toLowerCase()
        })
        .map((edge, index) => {
          const eventData = removeNullsFromArray(edge?.node?.data ?? [])
          return parseEventData(edge?.node?.id ?? index.toString(), eventData)
        })
    }
  })
}

export default useAlerts
