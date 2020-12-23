import { URIObj } from 'src/app/constants/backendURI';

export const environment = {
  production: true,
  backendURI: URIObj.getDeployedURI(),
  baseApi: '/api',
  versionApi: '/v1',
  cors: false,
};
