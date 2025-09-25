import { HttpMethod, httpClient } from '@activepieces/pieces-common';
  import { wedofAuth } from '../../..';
  import {
    createAction,
    Property,
  } from '@activepieces/pieces-framework';
  import { wedofCommon } from '../../common/wedof';
  
  export const getAttendee = createAction({
    auth: wedofAuth,
    name: 'getAttendee',
    displayName: "Récupération d'un apprenant",
    description: "Récupération d'un apprenant par son identifiant unique",
    props: {
      id: Property.ShortText({
        displayName: 'ID de l\'apprenant',
        description: "Sélectionner l'identifiant unique de l'apprenant",
        required: true,
      }),
    },
  
    async run(context) {
      return (
        await httpClient.sendRequest({
          method: HttpMethod.GET,
          url: wedofCommon.baseUrl + '/attendees/'+ context.propsValue.id,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
    },
  });