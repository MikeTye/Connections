export const intentStates = [
  {
    id: 'intent_1',
    profileId: 'profile_1',
    intentType: 'networking',
    title: 'Open to product collaborations',
    description: 'Looking to connect with PMs and founders.',
    isActive: true,
    prompts: [
      { id: 'prompt_1', text: 'What are you currently building?' },
      { id: 'prompt_2', text: 'How could we collaborate?' },
    ],
  },
  {
    id: 'intent_2',
    profileId: 'profile_2',
    intentType: 'friendship',
    title: 'Weekend hiking buddies',
    description: 'Looking for local hikes and trail tips.',
    isActive: true,
    prompts: [{ id: 'prompt_3', text: 'Favorite local trail?' }],
  },
];
