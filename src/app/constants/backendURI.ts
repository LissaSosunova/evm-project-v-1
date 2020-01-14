import { constants } from './default-constants';

const URIObj = { getLocalURI: () => {
        return `${constants.localBackEnd.protocol}://${constants.localBackEnd.host}:${constants.localBackEnd.port}`; },

    getDeployedURI: () => {
        return `${constants.deployedBackEnd.protocol}://${constants.deployedBackEnd.host}`;
    }

};

export const getURI = URIObj.getLocalURI();
