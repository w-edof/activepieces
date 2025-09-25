import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';

export const moveActivitie = createAction({
  auth: wedofAuth,
  name: 'moveActivitie',
  displayName: "Déplacer une activité / tâche",
  description: "Permet de déplacer une activité/tâche vers un dossier de formation ou de certification",
  props: {
    id: Property.ShortText({
        displayName: "ID de l'activité / tâche",
        required: true,
    }),
    entityClass: Property.StaticDropdown({
      displayName: "Choisir le type de dossier",
      description: "Permet de n'obtenir que les dossiers dans le type considéré - par défaut tous les types sont retournés",
      required: true,
      options: {
        options: [
          {label: "Dossier de certification", value: "CertificationFolder"},
          {label: "Dossier de formation", value: "RegistrationFolder"},
          {label: "Partenariat", value: "CertificationPartner"},
          {label: "Proposition commerciale", value: "Proposal"},
        ],
        disabled: false,
      },
    }),
    entityId: Property.ShortText({
      displayName: 'N° du dossier',
      description:
        'L\'entityId correspond à l\'externalId du dossier de formation ou de l\'externalId du dossier de certification',
      required: true,
    }),
  },
  async run(context) {
    const message = {
        entityClass: context.propsValue.entityClass ?? null,
        entityId: context.propsValue.entityId ?? null,
      };
      return (
        await httpClient.sendRequest({
          method: HttpMethod.POST,
          url:
            wedofCommon.baseUrl +
            '/activities/' +
            context.propsValue.id + '/move',
          body: message,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
  },
});
