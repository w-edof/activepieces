import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';
import dayjs from 'dayjs';

export const updateActivity = createAction({
  auth: wedofAuth,
  name: 'updateActivity',
  displayName: "Mettre à jour une activité",
  description: "Permet de mettre à jour une activité d'un dossier (Dossier de formation / Dossier de certification), un partenariat ou une proposition",
  props: {
    entityId: Property.ShortText({
      displayName: 'Id de l\'activité',
      description:
        'Sélectionner la propriété {Id} de l\'activité',
      required: true,
    }),
    title: Property.ShortText({
        displayName: 'Titre de l\'activité',
        required: true,
    }),
    dueDate: Property.DateTime({
        displayName: "Date d'échéance",
        description: 'Date au format YYYY-MM-DDTHH:mm:ssZ.',
        required: false,
    }),
    type:wedofCommon.tasks,
    qualiopiIndicators:wedofCommon.qualiopiIndicators,
    description: Property.ShortText({
        displayName: 'Description',
        required: false,
    }),
    eventTime: Property.DateTime({
      displayName: "Date de début de l'activité",
      description: 'Date au format YYYY-MM-DDTHH:mm:ssZ.',
      required: true,
    }),
    eventEndTime: Property.DateTime({
      displayName: "Date de fin de l'activité",
      description: 'Date au format YYYY-MM-DDTHH:mm:ssZ.',
      required: true,
    }),
    userEmail: Property.ShortText({
        displayName: "Responsable (email de l'utilisateur)",
        required: true,
    }),
    link: Property.ShortText({
        displayName: "Lien (url) vers l'activité",
        required: false,
    }),
    done: Property.StaticDropdown({
      displayName: 'Indique si l\'activité est terminée, par défaut Oui',
      required: false,
      defaultValue: true,
      options: {
        options: [
          { label: 'Oui', value: true },
          { label: 'Non', value: false },
        ],
      },
    }),

  },
  async run(context) {
    const message = {
        title: context.propsValue.title ?? null,
        dueDate: context.propsValue.dueDate ? dayjs(context.propsValue.dueDate) : null,
        eventEndTime: context.propsValue.eventEndTime ? dayjs(context.propsValue.eventEndTime) : null,
        type: context.propsValue.type,
        qualiopiIndicators: context.propsValue.qualiopiIndicators,
        description: context.propsValue.description ?? null,
        userEmail: context.propsValue.userEmail ?? null,
        link: context.propsValue.link ?? null,
        eventTime: context.propsValue.eventTime ? dayjs(context.propsValue.eventTime) : null,
        origin: "manual",
        done: context.propsValue.done ?? true,
      };
      return (
        await httpClient.sendRequest({
          method: HttpMethod.PUT,
          url:
            wedofCommon.baseUrl +
            '/activities/' + context.propsValue.entityId,
          body: message,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
  },
});
