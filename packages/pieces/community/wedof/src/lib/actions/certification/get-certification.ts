import { HttpMethod, QueryParams, httpClient } from '@activepieces/pieces-common';
  import { wedofAuth } from '../../..';
  import {
    createAction,
    Property,
  } from '@activepieces/pieces-framework';
  import { wedofCommon } from '../../common/wedof';
  
  export const getCertification = createAction({
    auth: wedofAuth,
    name: 'getCertification',
    displayName: "Récupération d'une certification",
    description: "Récupération d'une certification par son numéro 'Certif Info'",
    props: {
      certifInfo: Property.ShortText({
        displayName: 'Le numéro "Certif Info" de la certification',
        description: "Sélectionner le certifInfo unique de la certification",
        required: true,
      }),
      refresh: Property.StaticDropdown({
        displayName: 'Rafraîchir les données',
        required: false,
        options: {
          options: [
            { label: 'Oui', value: true },
            { label: 'Non', value: false },
          ],
        },
      }),
    },
  
    async run(context) {
      const params = {
        refresh: context.propsValue.refresh ?? null,
      };
      const queryParams: QueryParams = {};
      Object.keys(params).forEach((value) => {
        const key = value as keyof typeof params;
        if (params[key] != null && params[key] != undefined) {
          queryParams[value] = params[key] as unknown as string;
        }
      });
                
      return (
        await httpClient.sendRequest({
          method: HttpMethod.GET,
          queryParams: queryParams,
          url: wedofCommon.baseUrl + '/certifications/'+ context.propsValue.certifInfo,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
    },
  });