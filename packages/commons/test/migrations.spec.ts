import { expect } from 'chai';
import { BodyTypes, Migrations, ResponseMode } from '../src';

const applyMigration = (migrationId: number, environment: any) => {
  const migrationFunction = Migrations.find(
    (migration) => migration.id === migrationId
  )?.migrationFunction;

  if (!migrationFunction) {
    throw new Error('Cannot find migration function');
  }

  migrationFunction(environment);
};

describe('Migrations', () => {
  describe('migration n. 9', () => {
    it('should add "label" property to route responses', () => {
      const environment: any = {
        routes: [{ responses: [{}] }]
      };

      applyMigration(9, environment);

      expect(environment.routes[0].responses[0].label).to.not.be.undefined;
    });
  });

  describe('migration n. 10', () => {
    it('should add "proxyReqHeaders" and "proxyResHeaders" headers properties to environments', () => {
      const environment: any = {};

      applyMigration(10, environment);

      expect(environment.proxyReqHeaders).to.not.be.undefined;
      expect(environment.proxyReqHeaders[0].key).to.equal('');
      expect(environment.proxyResHeaders).to.not.be.undefined;
      expect(environment.proxyResHeaders[0].key).to.equal('');
    });
  });

  describe('migration n. 11', () => {
    it('should add "disableTemplating" at false to route responses', () => {
      const environment: any = {
        routes: [{ responses: [{ statusCode: '200' }] }]
      };

      applyMigration(11, environment);

      expect(environment.routes[0].responses[0].disableTemplating).to.equal(
        false
      );
      expect(environment.routes[0].responses[0].statusCode).to.equal(200);
    });
  });

  describe('migration n. 12', () => {
    it('should add "rulesOperator" at OR to route responses', () => {
      const environment: any = {
        routes: [{ responses: [{}] }]
      };

      applyMigration(12, environment);

      expect(environment.routes[0].responses[0].rulesOperator).to.equal('OR');
    });
  });

  describe('migration n. 13', () => {
    it('should add "randomResponse" to the route', () => {
      const environment: any = {
        routes: [{ responses: [{}] }]
      };

      applyMigration(13, environment);

      expect(environment.routes[0].randomResponse).to.equal(false);
    });
  });

  describe('migration n. 14', () => {
    it('should add "sequentialResponse" to the route', () => {
      const environment: any = {
        routes: [{ responses: [{}] }]
      };

      applyMigration(14, environment);

      expect(environment.routes[0].sequentialResponse).to.equal(false);
    });
  });

  describe('migration n. 15', () => {
    it('should add "proxyRemovePrefix" property to the environment', () => {
      const environment: any = {};

      applyMigration(15, environment);

      expect(environment.proxyRemovePrefix).to.equal(false);
    });
  });

  describe('migration n. 16', () => {
    it('should add "hostname" property to the environment', () => {
      const environment: any = {};

      applyMigration(16, environment);

      expect(environment.hostname).to.equal('0.0.0.0');
    });
  });

  describe('migration n. 17', () => {
    it('should add "fallbackTo404" at false to route responses', () => {
      const environment: any = {
        routes: [{ responses: [{}] }]
      };

      applyMigration(17, environment);

      expect(environment.routes[0].responses[0].fallbackTo404).to.equal(false);
    });
  });

  describe('migration n. 18', () => {
    it('should remove `isRegex` from rules and `operator` property to "equals" by default or "regex" if `isRegex` was true', () => {
      const environment: any = {
        routes: [
          {
            responses: [
              {
                rules: [
                  {
                    target: 'body',
                    modifier: 'test',
                    value: 'test',
                    isRegex: false
                  },
                  {
                    target: 'body',
                    modifier: 'test',
                    value: 'test',
                    isRegex: true
                  }
                ]
              }
            ]
          }
        ]
      };

      applyMigration(18, environment);

      expect(environment.routes[0].responses[0].rules[0].isRegex).to.equal(
        undefined
      );
      expect(environment.routes[0].responses[0].rules[0].operator).to.equal(
        'equals'
      );
      expect(environment.routes[0].responses[0].rules[1].isRegex).to.equal(
        undefined
      );
      expect(environment.routes[0].responses[0].rules[1].operator).to.equal(
        'regex'
      );
    });
  });

  describe('migration n. 19', () => {
    it('should build a default tlsOptions object and remove the old https property', () => {
      const environment: any = {
        https: true
      };

      applyMigration(19, environment);

      expect(environment.https).to.be.undefined;
      expect(environment.tlsOptions).to.deep.equal({
        enabled: true,
        type: 'CERT',
        pfxPath: '',
        certPath: '',
        keyPath: '',
        caPath: '',
        passphrase: ''
      });
    });
  });

  describe('migration n. 20', () => {
    it('should add a `default` property to the route responses', () => {
      const environment = {
        routes: [{ responses: [{}, {}] }]
      };

      applyMigration(20, environment);

      expect(environment.routes[0].responses[0]['default']).to.equal(true);
      expect(environment.routes[0].responses[1]['default']).to.equal(false);
    });
  });

  describe('migration n. 21', () => {
    it('should add `responseMode` and remove `sequentialResponse` and `randomResponse`, initialized to null', () => {
      const environment = {
        routes: [{ sequentialResponse: false, randomResponse: false }]
      };

      applyMigration(21, environment);

      expect(environment.routes[0]['responseMode']).to.equal(null);
      expect(environment.routes[0]['sequentialResponse']).to.equal(undefined);
      expect(environment.routes[0]['randomResponse']).to.equal(undefined);
    });

    it('should add `responseMode` and remove `sequentialResponse` and `randomResponse`, initialized to SEQUENTIAL', () => {
      const environment = {
        routes: [{ sequentialResponse: true, randomResponse: false }]
      };

      applyMigration(21, environment);

      expect(environment.routes[0]['responseMode']).to.equal(
        ResponseMode.SEQUENTIAL
      );
      expect(environment.routes[0]['sequentialResponse']).to.equal(undefined);
      expect(environment.routes[0]['randomResponse']).to.equal(undefined);
    });

    it('should add `responseMode` and remove `sequentialResponse` and `randomResponse`, initialized to RANDOM', () => {
      const environment = {
        routes: [{ sequentialResponse: false, randomResponse: true }]
      };

      applyMigration(21, environment);

      expect(environment.routes[0]['responseMode']).to.equal(
        ResponseMode.RANDOM
      );
      expect(environment.routes[0]['sequentialResponse']).to.equal(undefined);
      expect(environment.routes[0]['randomResponse']).to.equal(undefined);
    });
  });

  describe('migration n. 22', () => {
    it('should add `invert` to the response rules', () => {
      const environment = {
        routes: [
          {
            responses: [
              {
                rules: [
                  {
                    target: 'body',
                    modifier: 'test',
                    value: 'test',
                    operator: 'equals'
                  }
                ]
              }
            ]
          }
        ]
      };

      applyMigration(22, environment);

      expect(environment.routes[0].responses[0].rules[0]['invert']).to.equal(
        false
      );
    });
  });

  describe('migration n. 23', () => {
    it('should add `data` to the environment', () => {
      const environment: any = {};

      applyMigration(23, environment);

      expect(environment.data).to.be.an('array');
      expect(environment.data).to.be.empty;
    });
  });

  describe('migration n. 24', () => {
    it('should add `bodyType` and `databucketID` to the route responses and set it to INLINE by default or to FILE if a filepath was given', () => {
      const environment: any = {
        routes: [{ responses: [{ filePath: './file' }, { filePath: '' }] }]
      };

      applyMigration(24, environment);

      expect(environment.routes[0].responses[0].bodyType).to.equal(
        BodyTypes.FILE
      );
      expect(environment.routes[0].responses[1].bodyType).to.equal(
        BodyTypes.INLINE
      );
      expect(environment.routes[0].responses[0].databucketID).to.be.equal('');
    });
  });
});
