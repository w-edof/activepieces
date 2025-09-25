import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';
import dayjs from 'dayjs';

export const createActivitie = createAction({
  auth: wedofAuth,
  name: 'createActivitie',
  displayName: "Créer une activité",
  description: "Permet de créer une activité d'un dossier (Dossier de formation / Dossier de certification), un partenariat ou une proposition",
  props: {
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
        'Sélectionner la propriété {entityId} du dossier',
      required: true,
    }),
    title: Property.ShortText({
        displayName: "Titre de l'activité",
        required: true,
    }),
    type:wedofCommon.tasks,
    qualiopiIndicators:wedofCommon.qualiopiIndicators,
    description: Property.ShortText({
        displayName: 'Description',
        required: false,
    }),
    userEmail: Property.ShortText({
        displayName: "Responsable (email de l'utilisateur qui créé une activité)",
        required: true,
    }),
    eventTime: Property.DateTime({
      displayName: "Date de fin de l'activité",
      description: 'Date au format YYYY-MM-DDTHH:mm:ssZ.',
      required: true,
    }),
    eventEndTime: Property.DateTime({
     displayName: "Date de fin de l'activité",
     description: 'Date au format YYYY-MM-DDTHH:mm:ssZ.',
     required: false,
    }),
    link: Property.ShortText({
        displayName: "Lien (url) vers l'activité",
        required: false,
    }),
    dueDate: Property.DateTime({
        displayName: "Date à laquelle l'activité doit être finie",
        description: 'Date au format YYYY-MM-DDTHH:mm:ssZ.',
        required: false,
    }),
    done: Property.StaticDropdown({
      displayName: 'Indique si la tâche est terminée, par défaut Oui',
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
        eventEndTime: context.propsValue.eventEndTime ? dayjs(context.propsValue.eventEndTime) : null,
        type: context.propsValue.type,
        qualiopiIndicators: context.propsValue.qualiopiIndicators,
        description: context.propsValue.description ?? null,
        userEmail: context.propsValue.userEmail ?? null,
        link: context.propsValue.link ?? null,
        eventTime: context.propsValue.eventTime ? dayjs(context.propsValue.eventTime) : null,
        origin: "manual",
        done: context.propsValue.done ?? true,
        dueDate: context.propsValue.dueDate ? dayjs(context.propsValue.dueDate) : null,
      };
      return (
        await httpClient.sendRequest({
          method: HttpMethod.POST,
          url:
            wedofCommon.baseUrl +
            '/activities/' +
            context.propsValue.entityClass +
            '/'+ context.propsValue.entityId,
          body: message,
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': context.auth as string,
          },
        })
      ).body;
  },
});
