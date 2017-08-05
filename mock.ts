
import sinon = require("sinon");

export interface Logger {
  withPrefix(prefix: string): Logger;
  log(message: string): void;
}

export class ConsoleLogger implements Logger {
  constructor(private _prefix: string = "") {
  }
  withPrefix(prefix: string): Logger {
    return new ConsoleLogger(this._prefix + prefix);
  }
  log(message: string): void {
    console.log(`${this._prefix}${message}`);
  }
}

export class NullLogger implements Logger {
  withPrefix(prefix: string): Logger {
    return this;
  }
  log(message: string): void {
    // no-op
  }
}

interface ListenerContext<T, D> {
  id: string;
  once: boolean;
  listener: (this: T, data: D) => void;
  context?: T;
}

type EventListenerRegistry<Events> = {
  [E in keyof Events]: ListenerContext<any, Events[E]>[];
};

const randomId = () => Math.random().toString(36).substring(2);

class ContextualEventEmitter<Events> {
  private _registry: EventListenerRegistry<Events> = Object.create(null) as EventListenerRegistry<Events>;
  public on<E extends keyof Events, T>(event: E, listener: (this: T, data: Events[E]) => void, context?: T): string {
    return this.addEventListener(event, false, listener, context);
  }
  public once<E extends keyof Events, T>(event: E, listener: (this: T, data: Events[E]) => void, context?: T): string {
    return this.addEventListener(event, true, listener, context);
  }
  public off<E extends keyof Events>(event: E): void;
  public off<E extends keyof Events>(event: E, id: string): void;
  public off<E extends keyof Events>(event: E, id?: string): void {
    if (id === undefined) {
      this._registry[event] = [];
    } else {
      const idx = this._registry[event].findIndex((reg) => reg.id === id);
      if (idx !== -1) {
        this._registry[event].splice(idx, 1);
      }
    }
  }
  public emit<E extends keyof Events>(event: E, data: Events[E]): void {
    if (this._registry[event] !== undefined) {
      const listeners = this._registry[event];
      if (listeners !== undefined && listeners.length > 0) {
        for (let i = listeners.length - 1; i >= 0; --i) {
          const reg = listeners[i];
          reg.listener.call(reg.context, data);
          if (reg.once) {
            listeners.splice(i, 1);
          }
        }
      }
    }
  }
  private addEventListener<E extends keyof Events, T>(event: E, once: boolean, listener: (this: T, data: Events[E]) => void, context?: T): string {
    this._registry[event] = this._registry[event] || [];
    const id = randomId();
    this._registry[event].push({ id, once, context, listener });
    return id;
  }
}

class MockHostService implements PartyGameShow.Services.Host {
  private _logger: Logger;
  constructor(private _from: ContextualEventEmitter<PartyGameShow.Events.FromHost>, private _to: ContextualEventEmitter<PartyGameShow.Events.ToHost>, logger: Logger) {
    this._logger = logger.withPrefix("-host.");
  }
  listGames(): void {
    setTimeout(() => {
      this._logger.log(`listGames()`);
      this._from.emit("listGames", undefined);
    }, Math.random() * 10);
  }
  startRoom(): void {
    setTimeout(() => {
      this._logger.log(`startRoom()`);
      this._from.emit("startRoom", undefined);
    }, Math.random() * 10);
  }
  endRoom(): void {
    setTimeout(() => {
      this._logger.log(`endRoom()`);
      this._from.emit("endRoom", undefined);
    }, Math.random() * 10);
  }
  managePlayers(players: PartyGameShow.Requests.ManagePlayers): void {
    setTimeout(() => {
      this._logger.log(`managePlayers(players=${players})`);
      this._from.emit("managePlayers", players);
    }, Math.random() * 10);
  }
  startGame(game: PartyGameShow.Requests.NewGame): void {
    setTimeout(() => {
      this._logger.log(`startGame(type="${game.gametype}", players=${game.playerIDs})`);
      this._from.emit("startGame", game);
    }, Math.random() * 10);
  }
  endGame(): void {
    setTimeout(() => {
      this._logger.log(`endGame()`);
      this._from.emit("endGame", undefined);
    }, Math.random() * 10);
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): void {
    setTimeout(() => {
      this._logger.log(`sendPacket(msgID=${packet.msgID}, recipientIDs=${packet.recipientIDs})`);
      this._from.emit("sendPacket", packet);
    }, Math.random() * 10);
  }
  forceClear(): void {
    setTimeout(() => {
      this._logger.log(`forceClear()`);
      this._from.emit("forceClear", undefined);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void, context?: any): string {
    return this._to.on(event, listener, context);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void, context?: any): string {
    return this._to.once(event, listener, context);
  }
  removeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, id: string): void {
    this._to.off(event, id);
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.ToHost>(event: E) {
    this._to.off(event);
  }
}

class MockHostManager implements PartyGameShow.Managers.Host {
  private _logger: Logger;
  constructor(private _from: ContextualEventEmitter<PartyGameShow.Events.FromHost>, private _to: ContextualEventEmitter<PartyGameShow.Events.ToHost>, logger: Logger) {
    this._logger = logger.withPrefix("+host.");
  }
  availableGames(games: PartyGameShow.Responses.AvailableGames): void {
    setTimeout(() => {
      this._logger.log(`availableGames()`);
      this._to.emit("availableGames", games);
    }, Math.random() * 10);
  }
  onRoom(room: PartyGameShow.Room): void {
    setTimeout(() => {
      this._logger.log(`onRoom(room=${room.lobbyCode})`);
      this._to.emit("onRoom", room);
    }, Math.random() * 10);
  }
  gameContent(content: PartyGameShow.Game.Content): void {
    setTimeout(() => {
      this._logger.log(`gameContent()`);
      this._to.emit("gameContent", content);
    }, Math.random() * 10);
  }
  playerJoinedLobby(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerJoined(playerID=${player.playerID})`);
      this._to.emit("playerJoinedLobby", player);
    }, Math.random() * 10);
  }
  playerReady(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerReady(playerID=${player.playerID})`);
      this._to.emit("playerReady", player);
    }, Math.random() * 10);
  }
  playerUpdated(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerUpdated(playerID=${player.playerID})`);
      this._to.emit("playerUpdated", player);
    }, Math.random() * 10);
  }
  playerReturned(packet: PartyGameShow.Messages.ResponsePacket): void {
    setTimeout(() => {
      this._logger.log(`playerReturned(msgID=${packet.msgID}, playerID=${packet.playerID})`);
      this._to.emit("playerReturned", packet);
    }, Math.random() * 10);
  }
  onError(err: object): void {
    setTimeout(() => {
      this._logger.log(`onError(err=${err})`);
      this._to.emit("onError", err);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void, context?: any): string {
    return this._from.on(event, listener, context);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void, context?: any): string {
    return this._from.once(event, listener, context);
  }
  removeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, id: string): void {
    this._from.off(event, id);
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.FromHost>(event: E) {
    this._from.off(event);
  }
}

class MockClientService implements PartyGameShow.Services.Client {
  private _logger: Logger;
  constructor(private _from: ContextualEventEmitter<PartyGameShow.Events.FromClient>, private _to: ContextualEventEmitter<PartyGameShow.Events.ToClient>, logger: Logger) {
    this._logger = logger.withPrefix("-client.");
  }
  getPlayerInfo(_: void): void {
    setTimeout(() => {
      this._logger.log(`getPlayerInfo()`);
      this._from.emit("getPlayerInfo", undefined);
    }, Math.random() * 10);
  }
  updatePlayerInfo(request: Partial<PartyGameShow.Player>): void {
    setTimeout(() => {
      this._logger.log(`updatePlayerInfo(playerID=${request.playerID}, displayName=${request.displayName}, color=${request.color})`);
      this._from.emit("updatePlayerInfo", request);
    }, Math.random() * 10);
  }
  joinLobby(request: PartyGameShow.Requests.JoinLobby): void {
    setTimeout(() => {
      this._logger.log(`joinLobby(playerID=${request.playerID}, lobbyCode=${request.lobbyCode})`);
      this._from.emit("joinLobby", request);
    }, Math.random() * 10);
  }
  gameReady(): void {
    setTimeout(() => {
      this._logger.log(`gameReady()`);
      this._from.emit("gameReady", undefined);
    }, Math.random() * 10);
  }
  returnResponse(packet: PartyGameShow.Messages.ResponsePacket): void {
    setTimeout(() => {
      this._logger.log(`requestResponse(playerID=${packet.playerID}, msgID=${packet.msgID})`);
      this._from.emit("returnResponse", packet);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void, context?: any): string {
    return this._to.on(event, listener, context);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void, context?: any): string {
    return this._to.once(event, listener, context);
  }
  removeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, id: string): void {
    this._to.off(event, id);
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.ToClient>(event: E) {
    this._to.off(event);
  }
}

class MockClientManager implements PartyGameShow.Managers.Client {
  private _logger: Logger;
  constructor(private _from: ContextualEventEmitter<PartyGameShow.Events.FromClient>, private _to: ContextualEventEmitter<PartyGameShow.Events.ToClient>, logger: Logger) {
    this._logger = logger.withPrefix("+client.");
  }
  playerInfo(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerInfo(playerID=${player.playerID}, displayName=${player.displayName}, color=${player.color})`);
      this._to.emit("playerInfo", player);
    }, Math.random() * 10);
  }
  joinedRoom(room: PartyGameShow.Room): void {
    setTimeout(() => {
      this._logger.log(`joinedRoom(lobbyCode=${room.lobbyCode}, roomID=${room.roomID})`);
      this._to.emit("joinedRoom", room);
    }, Math.random() * 10);
  }
  roomClosed(_: void): void {
    setTimeout(() => {
      this._logger.log(`roomClosed()`);
      this._to.emit("roomClosed", undefined);
    }, Math.random() * 10);
  }
  loadGame(game: PartyGameShow.Responses.LoadGame): void {
    setTimeout(() => {
      this._logger.log(`loadGame(gametype=${game.gametype}, playerIDs=${game.playerIDs})`);
      this._to.emit("loadGame", game);
    }, Math.random() * 10);
  }
  unloadGame(): void {
    setTimeout(() => {
      this._logger.log(`unloadGame()`);
      this._to.emit("unloadGame", undefined);
    }, Math.random() * 10);
  }
  onPacket(packet: PartyGameShow.Messages.Packet): void {
    setTimeout(() => {
      this._logger.log(`onPacket(msgID=${packet.msgID})`);
      this._to.emit("onPacket", packet);
    }, Math.random() * 10);
  }
  onClear(): void {
    setTimeout(() => {
      this._logger.log(`onClear()`);
      this._to.emit("onClear", undefined);
    }, Math.random() * 10);
  }
  onError(err: object): void {
    setTimeout(() => {
      this._logger.log(`onError(err=${err})`);
      this._to.emit("onError", err);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void, context?: any): string {
    return this._from.on(event, listener, context);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void, context?: any): string {
    return this._from.once(event, listener, context);
  }
  removeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, id: string): void {
    this._from.off(event, id);
  }
  removeAllListeners<E extends keyof PartyGameShow.Events.FromClient>(event: E) {
    this._from.off(event);
  }
}

class MockServer implements PartyGameShow.Server {
  private _room: PartyGameShow.Room;
  private _clients: { [playerID: string]: PartyGameShow.Managers.Client } = {};
  constructor(private _host: PartyGameShow.Managers.Host, clients: PartyGameShow.Managers.Client[]) {
    this._host.addListener("listGames", this.listGames, this);
    this._host.addListener("startRoom", this.startRoom, this);
    this._host.addListener("endRoom", this.endRoom, this);
    this._host.addListener("startGame", this.startGame, this);
    this._host.addListener("endGame", this.endGame, this);
    this._host.addListener("sendPacket", this.sendPacket, this);
    this._host.addListener("forceClear", this.forceClear, this);
    clients.forEach((client) => {
      this.clientConnected(client);
    });
  }
  // FromHost
  listGames(): void {
    this._host.availableGames({
      games: [
        {
          gametype: "sketchy",
          metadata: {
            active: true,
            title: "#sketchy",
            subtitle: "sketchy subtitle",
            minPlayers: 3,
            version: "1.0.0",
          },
        },
      ],
    });
  }
  startRoom(): void {
    this._room = {
      roomID: "mock-room-id",
      lobbyCode: "ABCDEFG",
    };
    setTimeout(() => {
      this._host.onRoom(this._room);
    }, 0);
  }
  endRoom(): void {
    //
  }
  managePlayers(players: PartyGameShow.Requests.ManagePlayers): void {
    Object.keys(players).forEach((playerID) => {
      const action = players[playerID];
      if (action === "add") {
        this._clients[playerID].joinedRoom(this._room);
      }
    });
  }
  startGame(game: PartyGameShow.Requests.NewGame): void {
    game.playerIDs.forEach((playerID) => {
      this._clients[playerID].loadGame({
        gametype: game.gametype,
        playerIDs: game.playerIDs,
        reload: false,
      });
    });
    this._host.gameContent({
      base: {
        packID: `${game.gametype}-base`,
        data: {
          content: "BASE",
        },
      },
      extra: [
        {
          packID: `${game.gametype}-extra:0`,
          data: {
            content: "EXTRA-0",
          },
        },
        {
          packID: `${game.gametype}-extra:1`,
          data: {
            content: "EXTRA-1",
          },
        },
      ],
    });
  }
  endGame(): void {
    throw new Error("Method not implemented: endGame");
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): void {
    packet.recipientIDs.forEach((recipientID) => {
      this._clients[recipientID].onPacket(packet);
    });
  }
  forceClear(): void {
    throw new Error("Method not implemented: forceClear");
  }
  clientConnected(client: PartyGameShow.Managers.Client) {
    client.addListener("joinLobby", (request) => {
      if (request.lobbyCode === this._room.lobbyCode) {
        const player: PartyGameShow.Player = {
          playerID: request.playerID,
          displayName: request.playerID,
          color: "#000000",
        };
        this._clients[player.playerID] = client;
        client.addListener("updatePlayerInfo", (playerUpdate) => {
          if (playerUpdate.displayName) {
            player.displayName = playerUpdate.displayName;
          }
          if (playerUpdate.color) {
            player.color = playerUpdate.color;
          }
          this._host.playerUpdated(player);
        }, this);
        client.addListener("gameReady", () => {
          this._host.playerReady(player);
        }, this);
        client.addListener("returnResponse", (response) => {
          this._host.playerReturned(response);
        }, this);
        client.playerInfo(player);
        this._host.playerJoinedLobby(player);
      }
    }, this);
  }
}

export class MockHostApp implements PartyGameShow.Signals.FromHost {
  private _players: PartyGameShow.Player[] = [];
  constructor(private _service: PartyGameShow.Services.Host) {
    this._service.addListener("playerJoinedLobby", (player) => {
      this._players.push(player);
    }, this);
  }
  get players(): PartyGameShow.Player[] {
    return this._players;
  }
  addPlayerJoinedLobbyListener(listener: (player: PartyGameShow.Player) => void, context?: any): string {
    return this._service.addListener("playerJoinedLobby", listener, context);
  }
  listGames(): Promise<PartyGameShow.Responses.AvailableGames> {
    return new Promise((resolve) => {
      this._service.addOneTimeListener("availableGames", resolve);
      this._service.listGames(undefined);
    });
  }
  startRoom(): Promise<PartyGameShow.Room> {
    return new Promise((resolve) => {
      this._service.addOneTimeListener("onRoom", resolve);
      this._service.startRoom(undefined);
    });
  }
  endRoom(): void {
    this._service.endRoom(undefined);
  }
  managePlayers(players: PartyGameShow.Requests.ManagePlayers): void {
    this._service.managePlayers(players);
  }
  startGame(game: PartyGameShow.Requests.NewGame): Promise<void> {
    return new Promise<void>((resolve) => {
      let callbackID: string = "";
      let playerCountdown = game.playerIDs.length;
      const playersReady: { [playerID: string]: boolean } = {};
      const callback = (player: PartyGameShow.Player) => {
        if (!playersReady[player.playerID]) {
          playerCountdown--;
          if (playerCountdown === 0) {
            this._service.removeListener("playerReady", callbackID);
            resolve();
          }
        } else {
          playersReady[player.playerID] = true;
        }
      };
      callbackID = this._service.addListener("playerReady", callback, this);
      this._service.startGame(game);
    });
  }
  endGame(): void {
    this._service.endGame(undefined);
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): Promise<PartyGameShow.PlayerMap<PartyGameShow.Messages.ResponsePacket>> {
    return new Promise((resolve) => {
      let callbackID: string = "";
      let playerCountdown = packet.recipientIDs.length;
      const playersReturned: PartyGameShow.PlayerMap<PartyGameShow.Messages.ResponsePacket> = {};
      const callback = (response: PartyGameShow.Messages.ResponsePacket) => {
        if (packet.msgID === response.msgID) {
          if (playersReturned[response.playerID] === undefined) {
            playerCountdown--;
            if (playerCountdown === 0) {
              this._service.removeListener("playerReturned", callbackID);
              resolve(playersReturned);
            }
          }
          playersReturned[response.playerID] = response;
        }
      };
      callbackID = this._service.addListener("playerReturned", callback, this);
      this._service.sendPacket(packet);
    });
  }
  forceClear(): void {
    this._service.forceClear(undefined);
  }
}

export interface PlayerDefinition {
  info: PartyGameShow.Player;
  responses: {
    [msgID: string]: PartyGameShow.Messages.ResponsePayload;
  };
}

export interface ClientConnection {
  playerID: string;
  service: PartyGameShow.Services.Client;
  manager: PartyGameShow.Managers.Client;
}

function createClient(playerID: string, logger: Logger): ClientConnection {
  const client = new ContextualEventEmitter<PartyGameShow.Events.FromClient & PartyGameShow.Events.ToClient>();
  return {
    playerID,
    service: new MockClientService(client, client, logger),
    manager: new MockClientManager(client, client, logger),
  };
}

export type HostSpy = {
  [Event in keyof PartyGameShow.Events.ToHost]: sinon.SinonSpy;
};

export interface MockEnvironment {
  hostApp: MockHostApp;
  hostSpy: HostSpy;
  clientConnections: ClientConnection[];
}

export function buildMockEnvironment(players: PlayerDefinition[], logger: Logger): MockEnvironment {
  const host = new ContextualEventEmitter<PartyGameShow.Events.FromHost & PartyGameShow.Events.ToHost>();

  const hostService = new MockHostService(host, host, logger);
  const hostManager = new MockHostManager(host, host, logger);

  const clients = players.map((player) => {
    const clientLogger = logger.withPrefix(player.info.playerID);
    const client = createClient(player.info.playerID, clientLogger);
    hostService.addListener("playerJoinedLobby", (newPlayer) => {
      if (newPlayer.playerID === player.info.playerID) {
        client.manager.playerInfo(player.info);
      }
    });
    client.service.addListener("loadGame", (game) => {
      client.service.gameReady(undefined);
    });
    client.service.addListener("onPacket", (packet) => {
      const response = player.responses[packet.msgID];
      if (response) {
        client.service.returnResponse({
          msgID: packet.msgID,
          playerID: player.info.playerID,
          response,
        });
      }
    });
    return client;
  });

  const server = new MockServer(hostManager, clients.map((client) => client.manager));

  const hostSpy: HostSpy = {
    availableGames: sinon.spy(hostManager, "availableGames"),
    onRoom: sinon.spy(hostManager, "onRoom"),
    gameContent: sinon.spy(hostManager, "gameContent"),
    playerJoinedLobby: sinon.spy(hostManager, "playerJoinedLobby"),
    playerReady: sinon.spy(hostManager, "playerReady"),
    playerReturned: sinon.spy(hostManager, "playerReturned"),
    playerUpdated: sinon.spy(hostManager, "playerUpdated"),
    onError: sinon.spy(hostManager, "onError"),
  };

  const hostApp = new MockHostApp(hostService);

  return {
    hostApp,
    hostSpy,
    clientConnections: clients,
  };
}
