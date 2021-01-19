import { Config } from './interfaces/types';

const backendPort = 5006;
const frontendPort = 3000;

const config = {
    backendLocal: `http://localhost:${String(backendPort)}`,
    tokenExpiration: 3600,
    // backendDeploy: 'https://evm-backend.herokuapp.com',
    backendDeploy: 'https://evm-client.herokuapp.com',
    filesDomainLocal: `http://localhost:${String(backendPort)}`,
    filesDomainDeploy: 'https://evm-backend.herokuapp.com',
    frontendDomainLocal: `http://localhost:${String(frontendPort)}`,
    frontEndDomailDeploy: 'https://evm-client.herokuapp.com',
    mongodbLocal: 'mongodb://localhost:127.0.0.1:27017/eventmessenger-users',
    mongodbCloud: 'mongodb://uxoye5lnr17n5cgako0t:iee2XxqCffkfiovwx9TC@b8uw1ghe0wwsdmo-mongodb.services.clever-cloud.com:27017/b8uw1ghe0wwsdmo',
    version: 'v1'
};

let settings: Config;

if (process.env.NODE_ENV === 'production') {
    settings = {
        secretkeyForEmail: 'fghhrweyop76326mb09358j',
        secretkeyForPasswordReset: 'bvb47refh90bnqer09',
        secretKeyForRefreshToken: 'ghn45hjh578bnfSfgYuRIf67',
        filesDomain: config.filesDomainDeploy,
        confirmEmail: true,
        backendDomain: config.backendDeploy,
        frontendDomain: config.frontEndDomailDeploy,
        expireResetPasswordLink: 600000,
        expireChangeEmailLink: 600000,
        mongodb: config.mongodbCloud,
        backendPort,
        frontendPort,
        tokenExpiration: config.tokenExpiration,
        version: config.version
    };
} else {// for development, local settings
    settings = {
        secretkeyForEmail: 'fghhrweyop76326mb09358j',
        secretkeyForPasswordReset: 'bvb47refh90bnqer09',
        secretKeyForRefreshToken: 'ghn45hjh578bnfSfgYuRIf67',
        filesDomain: config.filesDomainLocal,
        confirmEmail: true,
        backendDomain: config.backendLocal,
        frontendDomain: config.frontendDomainLocal,
        expireResetPasswordLink: 600000,
        expireChangeEmailLink: 600000,
        mongodb: config.mongodbLocal,
        backendPort,
        frontendPort,
        tokenExpiration: config.tokenExpiration,
        version: config.version
    };
}

export {settings};
