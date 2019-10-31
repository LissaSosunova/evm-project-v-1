import { constants } from './default-constants';

export const URIObj = {
    getLocalURI: () => {
        return `${constants.localBackEnd.protocol}://${constants.localBackEnd.host}:${constants.localBackEnd.port}`; },

    getDeployedURI: () => {
        return `${constants.deployedBackEnd.protocol}://${constants.deployedBackEnd.host}`;
    }

};
