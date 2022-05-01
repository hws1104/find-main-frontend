import { useQuery, UseQueryResult } from 'react-query';
import { generatePinataApiKey } from 'queries/uploads';

export interface PinataApiKeyResult {
  JWT: string;
  pinata_api_key: string;
  pinata_api_secret: string;
}

interface GeneratePinataKeyVariables {
  token: string;
}

export default function useGeneratePinataKey(
  variables: GeneratePinataKeyVariables
): UseQueryResult<PinataApiKeyResult, Error> {
  return useQuery(
    useGeneratePinataKey.getKey(),
    () => generatePinataApiKey(variables.token),
    {
      enabled: Boolean(variables.token),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
}

useGeneratePinataKey.getKey = () => ['GeneratePinataApiKey'];
