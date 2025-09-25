import { HttpMethod, httpClient } from '@activepieces/pieces-common';
  import { wedofAuth } from '../../..';
  import {
    createAction,
    Property,
  } from '@activepieces/pieces-framework';
  import { wedofCommon } from '../../common/wedof';
  
  export const findAttendee = createAction({
    auth: wedofAuth,
    name: 'findAttendee',
    displayName: "Récupération d'un apprenant par email / telephone",
    description: "Récupération d'un apprenant par son email ou son téléphone",
    props: {
      query: Property.ShortText({
        displayName: 'Email / telephone de l\'apprenant',
        description: "Sélectionner l'email ou le téléphone de l'apprenant",
        required: true,
      }),
    },
  
    async run(context) {
      return (
        await httpClient.sendRequest({
          method: HttpMethod.GET,
          queryParams: {
            query: context.propsValue.query,
          },
          url: wedofCommon.baseUrl + '/attendees/find',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
    },
  });