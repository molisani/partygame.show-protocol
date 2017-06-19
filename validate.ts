// This file only used for compile-time checks of protocol definitions

declare var _hostService: PartyGameShow.Services.Host;
declare var _hostManager: PartyGameShow.Managers.Host;

_hostService.addListeners(_hostManager);
_hostManager.addListeners(_hostService);

declare var _clientService: PartyGameShow.Services.Client;
declare var _clientManager: PartyGameShow.Managers.Client;

_clientService.addListeners(_clientManager);
_clientManager.addListeners(_clientService);

class TestHostService implements PartyGameShow.Services.Host {
  listGames(_: void): void {
    throw new Error("Method not implemented.");
  }
  startRoom(_: void): void {
    throw new Error("Method not implemented.");
  }
  endRoom(_: void): void {
    throw new Error("Method not implemented.");
  }
  startGame(game: PartyGameShow.Requests.NewGame): void {
    throw new Error("Method not implemented.");
  }
  endGame(_: void): void {
    throw new Error("Method not implemented.");
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): void {
    throw new Error("Method not implemented.");
  }
  forceClear(_: void): void {
    throw new Error("Method not implemented.");
  }
  addListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.ToHost>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.ToHost>): void {
    throw new Error("Method not implemented.");
  }
}

class TestHostManager implements PartyGameShow.Managers.Host {
  availableGames(games: PartyGameShow.Responses.AvailableGames): void {
    throw new Error("Method not implemented.");
  }
  onRoom(room: PartyGameShow.Room): void {
    throw new Error("Method not implemented.");
  }
  gameContent(content: PartyGameShow.Game.Content): void {
    throw new Error("Method not implemented.");
  }
  playerJoined(player: PartyGameShow.Player): void {
    throw new Error("Method not implemented.");
  }
  playerUpdated(player: PartyGameShow.Player): void {
    throw new Error("Method not implemented.");
  }
  playerReady(player: PartyGameShow.Player): void {
    throw new Error("Method not implemented.");
  }
  playerReturned(packet: PartyGameShow.Messages.ResponsePacket): void {
    throw new Error("Method not implemented.");
  }
  addListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.FromHost>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.FromHost>): void {
    throw new Error("Method not implemented.");
  }
}

class TestClientService implements PartyGameShow.Services.Client {
  joinRoom(request: PartyGameShow.Requests.JoinRoom): void {
    throw new Error("Method not implemented.");
  }
  updatePlayerInfo(player: Partial<PartyGameShow.Player>): void {
    throw new Error("Method not implemented.");
  }
  gameReady(_: void): void {
    throw new Error("Method not implemented.");
  }
  returnResponse(packet: PartyGameShow.Messages.ResponsePacket): void {
    throw new Error("Method not implemented.");
  }
  addListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.ToClient>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.ToClient>): void {
    throw new Error("Method not implemented.");
  }
}

class TestClientManager implements PartyGameShow.Managers.Client {
  playerInfo(player: PartyGameShow.Player): void {
    throw new Error("Method not implemented.");
  }
  loadGame(game: PartyGameShow.Responses.LoadGame): void {
    throw new Error("Method not implemented.");
  }
  unloadGame(_: void): void {
    throw new Error("Method not implemented.");
  }
  onPacket(packet: PartyGameShow.Messages.Packet): void {
    throw new Error("Method not implemented.");
  }
  onClear(_: void): void {
    throw new Error("Method not implemented.");
  }
  addListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): void {
    throw new Error("Method not implemented.");
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.FromClient>): void {
    throw new Error("Method not implemented.");
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.FromClient>): void {
    throw new Error("Method not implemented.");
  }
}
