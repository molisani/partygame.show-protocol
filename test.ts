// This file only used for compile-time checks of protocol definitions

declare var hostService: PartyGameShow.Services.Host;
declare var hostManager: PartyGameShow.Managers.Host;

hostService.addListeners(hostManager);
hostManager.addListeners(hostService);

declare var clientService: PartyGameShow.Services.Client;
declare var clientManager: PartyGameShow.Managers.Client;

clientService.addListeners(clientManager);
clientManager.addListeners(clientService);
