import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';

export const deleteActivitie = createAction({
  auth: wedofAuth,
  name: 'deleteActivitie',
  displayName: "Supprimer une activité / tâche",
  description: "Permet de supprimer une activité d'un dossier (Dossier de formation / Dossier de certification), un partenariat ou une proposition",
  props: {
    entityId: Property.ShortText({
      displayName: 'Id de la tâche',
      description:
        'Sélectionner la propriété Id de la tâche / activité',
      required: true,
    }),
  },
  async run(context) {
      return (
        await httpClient.sendRequest({
          method: HttpMethod.DELETE,
          url:
            wedofCommon.baseUrl +
            '/activities/' +
            context.propsValue.entityId,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
  },
});
