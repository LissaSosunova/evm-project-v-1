import { URIObj } from 'src/app/constants/backendURI';

export const environment = {
  production: true,
  backendURI: URIObj.getDeployedURI()
};
