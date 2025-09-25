import { HttpMethod, httpClient } from '@activepieces/pieces-common';
  import { wedofAuth } from '../../..';
  import {
    createAction,
    Property,
  } from '@activepieces/pieces-framework';
  import { wedofCommon } from '../../common/wedof';
  
  export const downloadFile = createAction({
    auth: wedofAuth,
    name: 'downloadFile',
    displayName: "Télécharger un document d'une certification",
    description: "Télécharger le document d'une certification à l'aide de son id et de l'id du document",
    props: {
      certificationFileId: Property.ShortText({
        displayName: 'ID du document',
        description: "Sélectionner l'ID unique du document à télécharger",
        required: true,
      }),
      id: Property.ShortText({
        displayName: 'ID de la certification',
        description: "Sélectionner l'ID unique de la certification",
        required: true,
      }),
    },
  
    async run(context) {  
      return (
        await httpClient.sendRequest({
          method: HttpMethod.GET,
          url: wedofCommon.baseUrl + '/certifications/'+ context.propsValue.id + '/files/' + context.propsValue.certificationFileId,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
    },
  });