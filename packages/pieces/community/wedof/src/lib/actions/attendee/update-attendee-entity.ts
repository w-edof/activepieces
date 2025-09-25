import { wedofAuth } from '../../../index';
import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { wedofCommon } from '../../common/wedof';

export const updateAttendeeEntity = createAction({
  auth: wedofAuth,
  name: 'updateAttendeeEntity',
  displayName: "Modifier les données d'un apprenant depuis une entité",
  description: "Permet de Modifier les données d'un apprenant depuis une entité",
  props: {
    entityClass: Property.StaticDropdown({
      displayName: "Choisir le type de dossier",
      description: "Permet de n'obtenir que les dossiers dans le type considéré",
      required: true,
      options: {
        options: [
          {
            value: "CertificationFolder",
            label: 'Dossier de certification',
          },
          {
            value: "RegistrationFolder",
            label: 'Dossier de formation',
          },
        ],
        disabled: false,
      },
    }),
    entityId: Property.ShortText({
      displayName: 'Id de l\'apprenant',
      description: 'Identifiant unique de l\'apprenant / candidat',
      required: true,
    }),
    lastName: Property.ShortText({
      displayName: 'Nom',
      description: 'Nom de famille de l\'apprenant / candidat',
      required: false,
    }),
    firstName: Property.ShortText({
      displayName: 'Prénom',
      description: 'Prénom de l\'apprenant / candidat',
      required: false,
    }),
    firstName2: Property.ShortText({
      displayName: '2ème Prénom',
      description: '2ème Prénom de l\'apprenant / candidat',
      required: false,
    }),
    firstName3: Property.ShortText({
      displayName: '3ème Prénom',
      description: '3ème Prénom de l\'apprenant / candidat',
      required: false,
    }),
    dateOfBirth: Property.DateTime({
      displayName: "Date de naissance",
      description: 'Date au format YYYY-MM-DDTHH:mm:ssZ.',
      required: false,
    }),
    nameCityOfBirth: Property.ShortText({
      displayName: "ville de naissance",
      description: "Ville de naissance de l'apprenant / candidat (obligatoire si né(e) en France)",
      required: false,
    }),
    codeCityOfBirth: Property.ShortText({
      displayName: "Code Insee de la ville de naissance",
      description: "Code Insee de la ville de naissance de l'apprenant / candidat (obligatoire si né(e) en France)",
      required: false,
    }),
    codeCountryOfBirth: Property.ShortText({
      displayName: "Code COG du pays de naissance",
      description: "Code COG du pays de naissance sur 3 chiffres de l'apprenant / candidat (obligatoire si né(e) à l'étranger)",
      required: false,
    }),
    nameCountryOfBirth: Property.ShortText({
      displayName: "Nom du pays de naissance",
      description: "Pays de naissance de l'apprenant / candidat (obligatoire si né(e) à l'étranger)",
      required: false,
    }),
    gender: Property.StaticDropdown({
      displayName: 'Sexe de l\'apprenant / candidat',
      required: false,
      options: {
        options: [
          { label: 'Masculin', value: 'male' },
          { label: 'Féminin', value: 'female' },
        ],
      },
    }),
    birthname: Property.ShortText({
      displayName: "Nom de naissance de l'apprenant / candidat",
      required: false,
    }),
    number: Property.ShortText({
            displayName: "(Adresse) Numéro de rue",
            required: false,
          }),
          repetitionIndexLabel: Property.StaticDropdown({
            displayName: '(Adresse) Index de l\'adresse',
            required: false,
            options: {
              options: [
                { label: 'bis', value: 'bis' },
                { label: 'quinquies', value: 'quinquies' },
                { label: 'quater', value: 'quater' },
                { label: 'ter', value: 'ter' },
              ],
            },
          }),
          roadTypeLabel: Property.ShortText({
            displayName: "(Adresse) Type de voie",
            required: false,
          }),
          roadName: Property.ShortText({
            displayName: "(Adresse) Nom de la rue",
            required: false,
          }),
          zipCode: Property.ShortText({
            displayName: "(Adresse) Code postal",
            required: false,
          }),
          city: Property.ShortText({
            displayName: "(Adresse) Ville",
            required: false,
          }),
  },
  async run(context) {
    const message = {
      lastName: context.propsValue.lastName ?? null,
      firstName: context.propsValue.firstName ?? null,
      firstName2: context.propsValue.firstName2 ?? null,
      firstName3: context.propsValue.firstName3 ?? null,
      dateOfBirth: context.propsValue.dateOfBirth ?? null,
      nameCityOfBirth: context.propsValue.nameCityOfBirth ?? null,
      codeCityOfBirth: context.propsValue.codeCityOfBirth ?? null,
      codeCountryOfBirth: context.propsValue.codeCountryOfBirth ?? null,
      nameCountryOfBirth: context.propsValue.nameCountryOfBirth ?? null,
      gender: context.propsValue.gender ?? null,
      birthname: context.propsValue.birthname ?? null,
      address: {
        number: context.propsValue.number ?? null,
        repetitionIndexLabel: context.propsValue.repetitionIndexLabel ?? null,
        roadTypeLabel: context.propsValue.roadTypeLabel ?? null,
        roadName: context.propsValue.roadName ?? null,
        zipCode: context.propsValue.zipCode ?? null,
        city: context.propsValue.city ?? null,
      }
    };
    return (
      await httpClient.sendRequest({
        method: HttpMethod.POST,
        url: wedofCommon.baseUrl + '/attendees/' + context.propsValue.entityClass + '/' + context.propsValue.entityId + '/updateIdentificationData',
        body: message,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': context.auth as string,
        },
      })
    ).body;
  },
});