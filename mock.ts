
import sinon = require("sinon");

type Listener<T> = (data: T) => void;

type EventListenerRegistry<Events> = {
  [E in keyof Events]: Listener<Events[E]>[];
};

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

class EventEmitter<Events> {
  private _registry: EventListenerRegistry<Events> = {} as EventListenerRegistry<Events>;
  public addEventListener<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void {
    this._registry[event] = this._registry[event] || [];
    this._registry[event].push(listener);
  }
  public removeEventListener<E extends keyof Events>(event: E): void;
  public removeEventListener<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void;
  public removeEventListener<E extends keyof Events>(event: E, listener?: (data: Events[E]) => void): void {
    if (listener === undefined) {
      this._registry[event] = [];
    } else {
      const idx = this._registry[event].indexOf(listener);
      this._registry[event].splice(idx, 1);
    }
  }
  public dispatchEvent<E extends keyof Events>(event: E, data: Events[E]): void {
    if (this._registry[event] !== undefined) {
      this._registry[event].forEach((listener) => listener(data));
    }
  }
}

class MockHostService implements PartyGameShow.Services.Host {
  private _logger: Logger;
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromHost>, private _to: EventEmitter<PartyGameShow.Events.ToHost>, logger: Logger) {
    this._logger = logger.withPrefix("-host.");
  }
  listGames(): void {
    setTimeout(() => {
      this._logger.log(`listGames()`);
      this._from.dispatchEvent("listGames", undefined);
    }, Math.random() * 10);
  }
  startRoom(): void {
    setTimeout(() => {
      this._logger.log(`startRoom()`);
      this._from.dispatchEvent("startRoom", undefined);
    }, Math.random() * 10);
  }
  endRoom(): void {
    setTimeout(() => {
      this._logger.log(`endRoom()`);
      this._from.dispatchEvent("endRoom", undefined);
    }, Math.random() * 10);
  }
  startGame(game: PartyGameShow.Requests.NewGame): void {
    setTimeout(() => {
      this._logger.log(`startGame(type="${game.gametype}", players=${game.playerIDs})`);
      this._from.dispatchEvent("startGame", game);
    }, Math.random() * 10);
  }
  endGame(): void {
    setTimeout(() => {
      this._logger.log(`endGame()`);
      this._from.dispatchEvent("endGame", undefined);
    }, Math.random() * 10);
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): void {
    setTimeout(() => {
      this._logger.log(`sendPacket(msgID=${packet.msgID}, recipientIDs=${packet.recipientIDs})`);
      this._from.dispatchEvent("sendPacket", packet);
    }, Math.random() * 10);
  }
  forceClear(): void {
    setTimeout(() => {
      this._logger.log(`forceClear()`);
      this._from.dispatchEvent("forceClear", undefined);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): void {
    this._to.addEventListener(event, listener);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): void {
    const callback = (data) => {
      this._to.removeEventListener(event, callback);
      listener(data);
    };
    this._to.addEventListener(event, callback);
  }
  removeListener<E extends keyof PartyGameShow.Events.ToHost>(event: E, listener: (data: PartyGameShow.Events.ToHost[E]) => void): void {
    this._to.removeEventListener(event, listener);
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.ToHost>): void {
    if (listeners.availableGames) {
      this.addListener("availableGames", listeners.availableGames.bind(listeners));
    }
    if (listeners.onRoom) {
      this.addListener("onRoom", listeners.onRoom.bind(listeners));
    }
    if (listeners.playerJoined) {
      this.addListener("playerJoined", listeners.playerJoined.bind(listeners));
    }
    if (listeners.playerUpdated) {
      this.addListener("playerUpdated", listeners.playerUpdated.bind(listeners));
    }
    if (listeners.playerReady) {
      this.addListener("playerReady", listeners.playerReady.bind(listeners));
    }
    if (listeners.playerReturned) {
      this.addListener("playerReturned", listeners.playerReturned.bind(listeners));
    }
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.ToHost>): void {
    if (listeners.availableGames) {
      this.removeListener("availableGames", listeners.availableGames.bind(listeners));
    }
    if (listeners.onRoom) {
      this.removeListener("onRoom", listeners.onRoom.bind(listeners));
    }
    if (listeners.playerJoined) {
      this.removeListener("playerJoined", listeners.playerJoined.bind(listeners));
    }
    if (listeners.playerUpdated) {
      this.removeListener("playerUpdated", listeners.playerUpdated.bind(listeners));
    }
    if (listeners.playerReady) {
      this.removeListener("playerReady", listeners.playerReady.bind(listeners));
    }
    if (listeners.playerReturned) {
      this.removeListener("playerReturned", listeners.playerReturned.bind(listeners));
    }
  }
}

class MockHostManager implements PartyGameShow.Managers.Host {
  private _logger: Logger;
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromHost>, private _to: EventEmitter<PartyGameShow.Events.ToHost>, logger: Logger) {
    this._logger = logger.withPrefix("+host.");
  }
  availableGames(games: PartyGameShow.Responses.AvailableGames): void {
    setTimeout(() => {
      this._logger.log(`availableGames()`);
      this._to.dispatchEvent("availableGames", games);
    }, Math.random() * 10);
  }
  onRoom(room: PartyGameShow.Room): void {
    setTimeout(() => {
      this._logger.log(`onRoom(room=${room.lobbyCode})`);
      this._to.dispatchEvent("onRoom", room);
    }, Math.random() * 10);
  }
  gameContent(content: PartyGameShow.Responses.GameContent): void {
    setTimeout(() => {
      this._logger.log(`gameContent()`);
      this._to.dispatchEvent("gameContent", content);
    }, Math.random() * 10);
  }
  playerJoined(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerJoined(playerID=${player.playerID})`);
      this._to.dispatchEvent("playerJoined", player);
    }, Math.random() * 10);
  }
  playerReady(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerReady(playerID=${player.playerID})`);
      this._to.dispatchEvent("playerReady", player);
    }, Math.random() * 10);
  }
  playerUpdated(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerUpdated(playerID=${player.playerID})`);
      this._to.dispatchEvent("playerUpdated", player);
    }, Math.random() * 10);
  }
  playerReturned(packet: PartyGameShow.Messages.ResponsePacket): void {
    setTimeout(() => {
      this._logger.log(`playerReturned(msgID=${packet.msgID}, playerID=${packet.playerID})`);
      this._to.dispatchEvent("playerReturned", packet);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): void {
    this._from.addEventListener(event, listener);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): void {
    const callback = (data) => {
      this._from.removeEventListener(event, callback);
      listener(data);
    };
    this._from.addEventListener(event, callback);
  }
  removeListener<E extends keyof PartyGameShow.Events.FromHost>(event: E, listener: (data: PartyGameShow.Events.FromHost[E]) => void): void {
    this._from.removeEventListener(event, listener);
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.FromHost>): void {
    if (listeners.listGames) {
      this.addListener("listGames", listeners.listGames.bind(listeners));
    }
    if (listeners.startRoom) {
      this.addListener("startRoom", listeners.startRoom.bind(listeners));
    }
    if (listeners.endRoom) {
      this.addListener("endRoom", listeners.endRoom.bind(listeners));
    }
    if (listeners.startGame) {
      this.addListener("startGame", listeners.startGame.bind(listeners));
    }
    if (listeners.endGame) {
      this.addListener("endGame", listeners.endGame.bind(listeners));
    }
    if (listeners.sendPacket) {
      this.addListener("sendPacket", listeners.sendPacket.bind(listeners));
    }
    if (listeners.forceClear) {
      this.addListener("forceClear", listeners.forceClear.bind(listeners));
    }
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.FromHost>): void {
    if (listeners.listGames) {
      this.removeListener("listGames", listeners.listGames.bind(listeners));
    }
    if (listeners.startRoom) {
      this.removeListener("startRoom", listeners.startRoom.bind(listeners));
    }
    if (listeners.endRoom) {
      this.removeListener("endRoom", listeners.endRoom.bind(listeners));
    }
    if (listeners.startGame) {
      this.removeListener("startGame", listeners.startGame.bind(listeners));
    }
    if (listeners.endGame) {
      this.removeListener("endGame", listeners.endGame.bind(listeners));
    }
    if (listeners.sendPacket) {
      this.removeListener("sendPacket", listeners.sendPacket.bind(listeners));
    }
    if (listeners.forceClear) {
      this.removeListener("forceClear", listeners.forceClear.bind(listeners));
    }
  }
}

class MockClientService implements PartyGameShow.Services.Client {
  private _logger: Logger;
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromClient>, private _to: EventEmitter<PartyGameShow.Events.ToClient>, logger: Logger) {
    this._logger = logger.withPrefix("-client.");
  }
  joinRoom(request: PartyGameShow.Requests.JoinRoom): void {
    setTimeout(() => {
      this._logger.log(`joinRoom(playerID=${request.playerID}, lobbyCode=${request.lobbyCode})`);
      this._from.dispatchEvent("joinRoom", request);
    }, Math.random() * 10);
  }
  updatePlayerInfo(request: Partial<PartyGameShow.Player>): void {
    setTimeout(() => {
      this._logger.log(`updatePlayerInfo(playerID=${request.playerID}, displayName=${request.displayName}, color=${request.color})`);
      this._from.dispatchEvent("updatePlayerInfo", request);
    }, Math.random() * 10);
  }
  gameReady(): void {
    setTimeout(() => {
      this._logger.log(`gameReady()`);
      this._from.dispatchEvent("gameReady", undefined);
    }, Math.random() * 10);
  }
  returnResponse(packet: PartyGameShow.Messages.ResponsePacket): void {
    setTimeout(() => {
      this._logger.log(`requestResponse(playerID=${packet.playerID}, msgID=${packet.msgID})`);
      this._from.dispatchEvent("returnResponse", packet);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): void {
    this._to.addEventListener(event, listener);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): void {
    const callback = (data) => {
      this._to.removeEventListener(event, callback);
      listener(data);
    };
    this._to.addEventListener(event, callback);
  }
  removeListener<E extends keyof PartyGameShow.Events.ToClient>(event: E, listener: (data: PartyGameShow.Events.ToClient[E]) => void): void {
    this._to.removeEventListener(event, listener);
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.ToClient>): void {
    if (listeners.playerInfo) {
      this.addListener("playerInfo", listeners.playerInfo.bind(listeners));
    }
    if (listeners.loadGame) {
      this.addListener("loadGame", listeners.loadGame.bind(listeners));
    }
    if (listeners.unloadGame) {
      this.addListener("unloadGame", listeners.unloadGame.bind(listeners));
    }
    if (listeners.onPacket) {
      this.addListener("onPacket", listeners.onPacket.bind(listeners));
    }
    if (listeners.onClear) {
      this.addListener("onClear", listeners.onClear.bind(listeners));
    }
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.ToClient>): void {
    if (listeners.playerInfo) {
      this.removeListener("playerInfo", listeners.playerInfo.bind(listeners));
    }
    if (listeners.loadGame) {
      this.removeListener("loadGame", listeners.loadGame.bind(listeners));
    }
    if (listeners.unloadGame) {
      this.removeListener("unloadGame", listeners.unloadGame.bind(listeners));
    }
    if (listeners.onPacket) {
      this.removeListener("onPacket", listeners.onPacket.bind(listeners));
    }
    if (listeners.onClear) {
      this.removeListener("onClear", listeners.onClear.bind(listeners));
    }
  }
}

class MockClientManager implements PartyGameShow.Managers.Client {
  private _logger: Logger;
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromClient>, private _to: EventEmitter<PartyGameShow.Events.ToClient>, logger: Logger) {
    this._logger = logger.withPrefix("+client.");
  }
  playerInfo(player: PartyGameShow.Player): void {
    setTimeout(() => {
      this._logger.log(`playerInfo(playerID=${player.playerID}, displayName=${player.displayName}, color=${player.color})`);
      this._to.dispatchEvent("playerInfo", player);
    }, Math.random() * 10);
  }
  loadGame(game: PartyGameShow.Responses.LoadGame): void {
    setTimeout(() => {
      this._logger.log(`loadGame(gametype=${game.gametype}, playerIDs=${game.playerIDs})`);
      this._to.dispatchEvent("loadGame", game);
    }, Math.random() * 10);
  }
  unloadGame(): void {
    setTimeout(() => {
      this._logger.log(`unloadGame()`);
      this._to.dispatchEvent("unloadGame", undefined);
    }, Math.random() * 10);
  }
  onPacket(packet: PartyGameShow.Messages.Packet): void {
    setTimeout(() => {
      this._logger.log(`onPacket(msgID=${packet.msgID})`);
      this._to.dispatchEvent("onPacket", packet);
    }, Math.random() * 10);
  }
  onClear(): void {
    setTimeout(() => {
      this._logger.log(`onClear()`);
      this._to.dispatchEvent("onClear", undefined);
    }, Math.random() * 10);
  }
  addListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): void {
    this._from.addEventListener(event, listener);
  }
  addOneTimeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): void {
    const callback = (data) => {
      this._from.removeEventListener(event, callback);
      listener(data);
    };
    this._from.addEventListener(event, callback);
  }
  removeListener<E extends keyof PartyGameShow.Events.FromClient>(event: E, listener: (data: PartyGameShow.Events.FromClient[E]) => void): void {
    this._from.addEventListener(event, listener);
  }
  addListeners(listeners: Partial<PartyGameShow.Signals.FromClient>): void {
    if (listeners.joinRoom) {
      this.addListener("joinRoom", listeners.joinRoom.bind(listeners));
    }
    if (listeners.updatePlayerInfo) {
      this.addListener("updatePlayerInfo", listeners.updatePlayerInfo.bind(listeners));
    }
    if (listeners.gameReady) {
      this.addListener("gameReady", listeners.gameReady.bind(listeners));
    }
    if (listeners.returnResponse) {
      this.addListener("returnResponse", listeners.returnResponse.bind(listeners));
    }
  }
  removeListeners(listeners: Partial<PartyGameShow.Signals.FromClient>): void {
    if (listeners.joinRoom) {
      this.removeListener("joinRoom", listeners.joinRoom.bind(listeners));
    }
    if (listeners.updatePlayerInfo) {
      this.removeListener("updatePlayerInfo", listeners.updatePlayerInfo.bind(listeners));
    }
    if (listeners.gameReady) {
      this.removeListener("gameReady", listeners.gameReady.bind(listeners));
    }
    if (listeners.returnResponse) {
      this.removeListener("returnResponse", listeners.returnResponse.bind(listeners));
    }
  }
}

class MockServer implements PartyGameShow.Server {
  private _room: PartyGameShow.Room;
  private _clients: { [playerID: string]: PartyGameShow.Managers.Client } = {};
  constructor(private _host: PartyGameShow.Managers.Host, clients: PartyGameShow.Managers.Client[]) {
    this._host.addListeners(this);
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
        data: "BASE",
      },
      extra: [
        {
          packID: `${game.gametype}-extra:0`,
          data: "EXTRA-0",
        },
        {
          packID: `${game.gametype}-extra:1`,
          data: "EXTRA-1",
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
    client.addListener("joinRoom", (request) => {
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
        });
        client.addListener("gameReady", () => {
          this._host.playerReady(player);
        });
        client.addListener("returnResponse", (response) => {
          this._host.playerReturned(response);
        });
        client.playerInfo(player);
        this._host.playerJoined(player);
      }
    });
  }
}

export class MockHostApp implements PartyGameShow.Signals.FromHost {
  private _players: PartyGameShow.Player[] = [];
  constructor(private _service: PartyGameShow.Services.Host) {
    this._service.addListener("playerJoined", (player) => {
      this._players.push(player);
    });
  }
  get players(): PartyGameShow.Player[] {
    return this._players;
  }
  addPlayerJoinedListener(listener: (player: PartyGameShow.Player) => void): void {
    return this._service.addListener("playerJoined", listener);
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
  startGame(game: PartyGameShow.Requests.NewGame): Promise<void> {
    return new Promise<void>((resolve) => {
      let playerCountdown = game.playerIDs.length;
      const playersReady: { [playerID: string]: boolean } = {};
      const callback = (player: PartyGameShow.Player) => {
        if (!playersReady[player.playerID]) {
          playerCountdown--;
          if (playerCountdown === 0) {
            this._service.removeListener("playerReady", callback);
            resolve();
          }
        } else {
          playersReady[player.playerID] = true;
        }
      };
      this._service.addListener("playerReady", callback);
      this._service.startGame(game);
    });
  }
  endGame(): void {
    this._service.endGame(undefined);
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): Promise<PartyGameShow.PlayerMap<PartyGameShow.Messages.ResponsePacket>> {
    return new Promise((resolve) => {
      let playerCountdown = packet.recipientIDs.length;
      const playersReturned: PartyGameShow.PlayerMap<PartyGameShow.Messages.ResponsePacket> = {};
      const callback = (response: PartyGameShow.Messages.ResponsePacket) => {
        if (packet.msgID === response.msgID) {
          if (playersReturned[response.playerID] === undefined) {
            playerCountdown--;
            if (playerCountdown === 0) {
              this._service.removeListener("playerReturned", callback);
              resolve(playersReturned);
            }
          }
          playersReturned[response.playerID] = response;
        }
      };
      this._service.addListener("playerReturned", callback);
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
  const client = new EventEmitter<PartyGameShow.Events.FromClient & PartyGameShow.Events.ToClient>();
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
  const host = new EventEmitter<PartyGameShow.Events.FromHost & PartyGameShow.Events.ToHost>();

  const hostService = new MockHostService(host, host, logger);
  const hostManager = new MockHostManager(host, host, logger);

  const clients = players.map((player) => {
    const clientLogger = logger.withPrefix(player.info.playerID);
    const client = createClient(player.info.playerID, clientLogger);
    hostService.addListener("playerJoined", (newPlayer) => {
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
    playerJoined: sinon.spy(hostManager, "playerJoined"),
    playerReady: sinon.spy(hostManager, "playerReady"),
    playerReturned: sinon.spy(hostManager, "playerReturned"),
    playerUpdated: sinon.spy(hostManager, "playerUpdated"),
  };

  const hostApp = new MockHostApp(hostService);

  return {
    hostApp,
    hostSpy,
    clientConnections: clients,
  };
}
