// This file only used for compile-time checks of protocol definitions

declare var _hostService: PartyGameShow.Services.Host;
declare var _hostManager: PartyGameShow.Managers.Host;

_hostService.addListener("availableGames", _hostManager.availableGames, _hostManager);
_hostService.addListener("onRoom", _hostManager.onRoom, _hostManager);
_hostService.addListener("gameContent", _hostManager.gameContent, _hostManager);
_hostService.addListener("playerJoined", _hostManager.playerJoined, _hostManager);
_hostService.addListener("playerUpdated", _hostManager.playerUpdated, _hostManager);
_hostService.addListener("playerReady", _hostManager.playerReady, _hostManager);
_hostService.addListener("playerReturned", _hostManager.playerReturned, _hostManager);
_hostService.addListener("onError", _hostManager.onError, _hostManager);

_hostManager.addListener("listGames", _hostService.listGames, _hostService);
_hostManager.addListener("startRoom", _hostService.startRoom, _hostService);
_hostManager.addListener("endRoom", _hostService.endRoom, _hostService);
_hostManager.addListener("startGame", _hostService.startGame, _hostService);
_hostManager.addListener("endGame", _hostService.endGame, _hostService);
_hostManager.addListener("sendPacket", _hostService.sendPacket, _hostService);
_hostManager.addListener("forceClear", _hostService.forceClear, _hostService);

declare var _clientService: PartyGameShow.Services.Client;
declare var _clientManager: PartyGameShow.Managers.Client;

_clientService.addListener("playerInfo", _clientManager.playerInfo, _clientManager);
_clientService.addListener("joinedRoom", _clientManager.joinedRoom, _clientManager);
_clientService.addListener("loadGame", _clientManager.loadGame, _clientManager);
_clientService.addListener("unloadGame", _clientManager.unloadGame, _clientManager);
_clientService.addListener("onPacket", _clientManager.onPacket, _clientManager);
_clientService.addListener("onClear", _clientManager.onClear, _clientManager);
_clientService.addListener("onError", _clientManager.onError, _clientManager);

_clientManager.addListener("getPlayerInfo", _clientService.getPlayerInfo, _clientService);
_clientManager.addListener("updatePlayerInfo", _clientService.updatePlayerInfo, _clientService);
_clientManager.addListener("joinRoom", _clientService.joinRoom, _clientService);
_clientManager.addListener("gameReady", _clientService.gameReady, _clientService);
_clientManager.addListener("returnResponse", _clientService.returnResponse, _clientService);

class TestHostService implements PartyGameShow.Services.Host {
  listGames(): void {
    throw new Error("Method not implemented.");
  }
  startRoom(): void {
    throw new Error("Method not implemented.");
  }
  endRoom(): void {
    throw new Error("Method not implemented.");
  }
  startGame(game: PartyGameShow.Requests.NewGame): void {
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
  addListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, id: string): void {
    throw new Error("Method not implemented.");
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.ToHost>(event: E) {
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
  onError(err: object): void {
    throw new Error("Method not implemented.");
  }
  addListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, id: string): void {
    throw new Error("Method not implemented.");
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.FromHost>(event: E) {
    throw new Error("Method not implemented.");
  }
}

class TestClientService implements PartyGameShow.Services.Client {
  getPlayerInfo(_: void): void {
    throw new Error("Method not implemented.");
  }
  updatePlayerInfo(player: Partial<PartyGameShow.Player>): void {
    throw new Error("Method not implemented.");
  }
  joinRoom(request: PartyGameShow.Requests.JoinRoom): void {
    throw new Error("Method not implemented.");
  }
  gameReady(_: void): void {
    throw new Error("Method not implemented.");
  }
  returnResponse(packet: PartyGameShow.Messages.ResponsePacket): void {
    throw new Error("Method not implemented.");
  }
  addListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, id: string): void {
    throw new Error("Method not implemented.");
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.ToClient>(event: E) {
    throw new Error("Method not implemented.");
  }
}

class TestClientManager implements PartyGameShow.Managers.Client {
  playerInfo(player: PartyGameShow.Player): void {
    throw new Error("Method not implemented.");
  }
  joinedRoom(room: PartyGameShow.Room): void {
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
  onError(err: object): void {
    throw new Error("Method not implemented.");
  }
  addListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): string {
    throw new Error("Method not implemented.");
  }
  removeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, id: string): void {
    throw new Error("Method not implemented.");
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.FromClient>(event: E) {
    throw new Error("Method not implemented.");
  }
}
