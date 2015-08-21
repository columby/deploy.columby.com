'use strict';

module.exports = {
  environment : process.env.NODE_ENV           || 'development',
  port        : process.env.NODE_DEPLOY_PORT   || 8001,
  branch      : process.env.NODE_DEPLOY_BRANCH || 'develop',
  secret      : process.env.NODE_DEPLOY_SECRET || '12345',
  
};
