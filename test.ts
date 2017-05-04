// This file only used for compile-time checks of protocol definitions

declare var hostService: PartyGameShow.Services.Host;
declare var hostManager: PartyGameShow.Managers.Host;

hostService.addListeners(hostManager);
hostManager.addListeners(hostService);

declare var clientService: PartyGameShow.Services.Client;
declare var clientManager: PartyGameShow.Managers.Client;

clientService.addListeners(clientManager);
clientManager.addListeners(clientService);

class TestHostService implements PartyGameShow.Services.Host {
  startGame(room: PartyGameShow.Room): void {
    throw new Error("Method not implemented.");
  }
  endGame(): void {
    throw new Error("Method not implemented.");
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): void {
    throw new Error("Method not implemented.");
  }
  forceClear(): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Actions.ToHost>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Actions.ToHost>): void {
    throw new Error("Method not implemented.");
  }
}

class TestHostManager implements PartyGameShow.Managers.Host {
  playerJoined(player: PartyGameShow.Player): void {
    throw new Error("Method not implemented.");
  }
  playerReturned(packet: PartyGameShow.Messages.ResponsePacket): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Actions.FromHost>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Actions.FromHost>): void {
    throw new Error("Method not implemented.");
  }
}

class TestClientService implements PartyGameShow.Services.Client {
  joinRoom(request: PartyGameShow.JoinRequest): void {
    throw new Error("Method not implemented.");
  }
  returnResponse(packet: PartyGameShow.Messages.ResponsePacket): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Actions.ToClient>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Actions.ToClient>): void {
    throw new Error("Method not implemented.");
  }
}

class TestClientManager implements PartyGameShow.Managers.Client {
  playerInfo(player: PartyGameShow.Player): void {
    throw new Error("Method not implemented.");
  }
  loadGame(gametype: string): void {
    throw new Error("Method not implemented.");
  }
  unloadGame(): void {
    throw new Error("Method not implemented.");
  }
  onPacket(packet: PartyGameShow.Messages.Packet): void {
    throw new Error("Method not implemented.");
  }
  onClear(): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Actions.FromClient>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Actions.FromClient>): void {
    throw new Error("Method not implemented.");
  }
}
