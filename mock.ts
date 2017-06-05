
type Listener<T> = (data: T) => void;

type EventListenerRegistry<Events> = {
  [E in keyof Events]: Listener<Events[E]>[];
};

class EventEmitter<Events> {
  private _registry: EventListenerRegistry<Events> = {} as EventListenerRegistry<Events>;
  public addEventListener<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void {
    this._registry[event] = this._registry[event] || [];
    this._registry[event].push(listener);
  }
  public removeEventListener<E extends keyof Events>(event: E): void
  public removeEventListener<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void
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
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromHost>, private _to: EventEmitter<PartyGameShow.Events.ToHost>) {
  }
  listGames(): void {
    setTimeout(() => {
      console.log(`-host.listGames()`);
      this._from.dispatchEvent("listGames", undefined);
    }, Math.random() * 10);
  }
  startRoom(): void {
    setTimeout(() => {
      console.log(`-host.startRoom()`);
      this._from.dispatchEvent("startRoom", undefined);
    }, Math.random() * 10);
  }
  endRoom(): void {
    setTimeout(() => {
      console.log(`-host.endRoom()`);
      this._from.dispatchEvent("endRoom", undefined);
    }, Math.random() * 10);
  }
  startGame(game: PartyGameShow.Requests.NewGame): void {
    setTimeout(() => {
      console.log(`-host.startGame(type="${game.gametype}", players=${game.playerIDs})`);
      this._from.dispatchEvent("startGame", game);
    }, Math.random() * 10);
  }
  endGame(): void {
    setTimeout(() => {
      console.log(`-host.endGame()`);
      this._from.dispatchEvent("endGame", undefined);
    }, Math.random() * 10);
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): void {
    setTimeout(() => {
      console.log(`-host.sendPacket(msgID=${packet.msgID}, recipientIDs=${packet.recipientIDs})`);
      this._from.dispatchEvent("sendPacket", packet);
    }, Math.random() * 10);
  }
  forceClear(): void {
    setTimeout(() => {
      console.log(`-host.forceClear()`);
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
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromHost>, private _to: EventEmitter<PartyGameShow.Events.ToHost>) {
  }
  availableGames(games: PartyGameShow.Responses.AvailableGames): void {
    setTimeout(() => {
      console.log(`+host.availableGames()`);
      this._to.dispatchEvent("availableGames", games);
    }, Math.random() * 10);
  }
  onRoom(room: PartyGameShow.Room): void {
    setTimeout(() => {
      console.log(`+host.onRoom(room=${room.lobbyCode})`);
      this._to.dispatchEvent("onRoom", room);
    }, Math.random() * 10);
  }
  playerJoined(player: PartyGameShow.Player): void {
    setTimeout(() => {
      console.log(`+host.playerJoined(playerID=${player.playerID})`);
      this._to.dispatchEvent("playerJoined", player);
    }, Math.random() * 10);
  }
  playerReady(player: PartyGameShow.Player): void {
    setTimeout(() => {
      console.log(`+host.playerReady(playerID=${player.playerID})`);
      this._to.dispatchEvent("playerReady", player);
    }, Math.random() * 10);
  }
  playerUpdated(player: PartyGameShow.Player): void {
    setTimeout(() => {
      console.log(`+host.playerUpdated(playerID=${player.playerID})`);
      this._to.dispatchEvent("playerUpdated", player);
    }, Math.random() * 10);
  }
  playerReturned(packet: PartyGameShow.Messages.ResponsePacket): void {
    setTimeout(() => {
      console.log(`+host.playerReturned(msgID=${packet.msgID}, playerID=${packet.playerID})`);
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
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromClient>, private _to: EventEmitter<PartyGameShow.Events.ToClient>) {
  }
  joinRoom(request: PartyGameShow.Requests.JoinRoom): void {
    setTimeout(() => {
      console.log(`-client.joinRoom(playerID=${request.playerID}, lobbyCode=${request.lobbyCode})`);
      this._from.dispatchEvent("joinRoom", request);
    }, Math.random() * 10);
  }
  updatePlayerInfo(request: Partial<PartyGameShow.Player>): void {
    setTimeout(() => {
      console.log(`-client.updatePlayerInfo(playerID=${request.playerID}, displayName=${request.displayName}, color=${request.color})`);
      this._from.dispatchEvent("updatePlayerInfo", request);
    }, Math.random() * 10);
  }
  gameReady(): void {
    setTimeout(() => {
      console.log(`-client.gameReady()`);
      this._from.dispatchEvent("gameReady", undefined);
    }, Math.random() * 10);
  }
  returnResponse(packet: PartyGameShow.Messages.ResponsePacket): void {
    setTimeout(() => {
      console.log(`-client.requestResponse(playerID=${packet.playerID}, msgID=${packet.msgID})`);
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
  constructor(private _from: EventEmitter<PartyGameShow.Events.FromClient>, private _to: EventEmitter<PartyGameShow.Events.ToClient>) {
  }
  playerInfo(player: PartyGameShow.Player): void {
    setTimeout(() => {
      console.log(`+client.playerInfo(playerID=${player.playerID}, displayName=${player.displayName}, color=${player.color})`);
      this._to.dispatchEvent("playerInfo", player);
    }, Math.random() * 10);
  }
  loadGame(game: PartyGameShow.Responses.LoadGame): void {
    setTimeout(() => {
      console.log(`+client.loadGame(gametype=${game.gametype}, playerIDs=${game.playerIDs})`);
      this._to.dispatchEvent("loadGame", game);
    }, Math.random() * 10);
  }
  unloadGame(): void {
    setTimeout(() => {
      console.log(`+client.unloadGame()`);
      this._to.dispatchEvent("unloadGame", undefined);
    }, Math.random() * 10);
  }
  onPacket(packet: PartyGameShow.Messages.Packet): void {
    setTimeout(() => {
      console.log(`+client.onPacket(msgID=${packet.msgID})`);
      this._to.dispatchEvent("onPacket", packet);
    }, Math.random() * 10);
  }
  onClear(): void {
    setTimeout(() => {
      console.log(`+client.onClear()`);
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
          gametype: 'sketchy',
          metadata: {
            active: true,
            title: '#sketchy',
            subtitle: 'sketchy subtitle',
            minPlayers: 3,
            version: '1.0.0',
          }
        }
      ]
    });
  }
  startRoom(): void {
    this._room = {
      "roomID": "mock-room-id",
      "lobbyCode": "ABCDEFG",
    };
    setTimeout(() => {
      this._host.onRoom(this._room);
    }, 0);
  }
  endRoom(): void {
  }
  startGame(game: PartyGameShow.Requests.NewGame): void {
    game.playerIDs.forEach((playerID) => {
      this._clients[playerID].loadGame({
        gametype: game.gametype,
        playerIDs: game.playerIDs,
        reload: false,
      });
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
          color: '#000000',
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

class MockHostApp implements PartyGameShow.Signals.FromHost {
  private _players: PartyGameShow.Player[] = [];
  constructor(private _service: PartyGameShow.Services.Host) {
    this._service.addListener("playerJoined", (player) => {
      this._players.push(player);
    });
  }
  get players(): PartyGameShow.Player[] {
    return this._players;
  }
  listGames(): Promise<PartyGameShow.Game.Loader[]> {
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
      }
      this._service.addListener("playerReady", callback);
      this._service.startGame(game);
    });
  }
  endGame(): void {
    this._service.endGame(undefined);
  }
  sendPacket(packet: PartyGameShow.Messages.Packet): Promise<PartyGameShow.Messages.ResponsePacket> {
    return new Promise((resolve) => {
      let playerCountdown = packet.recipientIDs.length;
      const playersReturned: { [playerID: string]: boolean } = {};
      const callback = (response: PartyGameShow.Messages.ResponsePacket) => {
        if (packet.msgID === response.msgID) {
          if (!playersReturned[response.playerID]) {
            playerCountdown--;
            if (playerCountdown === 0) {
              this._service.removeListener("playerReturned", callback);
              resolve();
            }
          } else {
            playersReturned[response.playerID] = true;
          }
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


const host = new EventEmitter<PartyGameShow.Events.FromHost & PartyGameShow.Events.ToHost>();



const hostService = new MockHostService(host, host);
const hostManager = new MockHostManager(host, host);

interface ClientConnection {
  playerID: string;
  service: PartyGameShow.Services.Client;
  manager: PartyGameShow.Managers.Client;
}

function createClient(playerID: string) {
  const client = new EventEmitter<PartyGameShow.Events.FromClient & PartyGameShow.Events.ToClient>();
  return {
    playerID: playerID,
    service: new MockClientService(client, client),
    manager: new MockClientManager(client, client),
  };
}

const alpha = createClient("alpha");
const bravo = createClient("bravo");
const charlie = createClient("charlie");

const clients = [alpha, bravo, charlie];
const clientManagers = [alpha.manager, bravo.manager, charlie.manager];

const server = new MockServer(hostManager, clientManagers);

const hostApp = new MockHostApp(hostService);

interface Message {
  hostPacket: PartyGameShow.Messages.Packet,
  clientResponses: {
    [playerID: string]: PartyGameShow.Messages.ResponsePacket,
  },
}

function createMessage(msgID: string) {
  return {
    hostPacket: {
      msgID: msgID,
      recipientIDs: ["alpha", "bravo", "charlie"],
      payload: {
        type: "",
      },
      expiresAfter: 0,
      notify: true,
    },
    clientResponses: {
      "alpha": {
        msgID: msgID,
        playerID: "alpha",
        response: {
          type: "",
          authorID: "alpha",
        }
      },
      "bravo": {
        msgID: msgID,
        playerID: "bravo",
        response: {
          type: "",
          authorID: "bravo",
        }
      },
      "charlie": {
        msgID: msgID,
        playerID: "charlie",
        response: {
          type: "",
          authorID: "charlie",
        }
      },
    }
  };
}


class TestRunner {
  constructor(private _host: MockHostApp, private _clients: ClientConnection[]) { }
  private processMessage(message: Message): Promise<any> {
    this._clients.forEach((client) => {
      const response = message.clientResponses[client.playerID];
      if (response !== undefined) {
        client.service.addOneTimeListener("onPacket", (packet) => {
          console.log(`playetID=${client.playerID} returning response for msgID=${packet.msgID}=${response.msgID}`);
          client.service.returnResponse(response);
        });
      }
    });
    return this._host.sendPacket(message.hostPacket).then(() => {
      console.log(`done sending message: ${message.hostPacket.msgID}`);
    });
  }
  public connect(): Promise<any> {
    return this._host.startRoom().then((room) => {
      this._clients.forEach((client) => {
        client.service.joinRoom({
          playerID: client.playerID,
          lobbyCode: room.lobbyCode,
        });
      });
      const checkForPlayers = (): Promise<any> => {
        if (this._host.players.length !== this._clients.length) {
          console.log(`only ${this._host.players.length} out of ${this._clients.length} players joined`);
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(checkForPlayers());
            });
          });
        } else {
          console.log(`all players joined`);
          return Promise.resolve();
        }
      };
      return checkForPlayers();
    });
  }
  public simpleGame(messages: Message[]): Promise<any> {
    this._clients.forEach((client) => {
      client.service.addOneTimeListener("loadGame", (game) => {
        client.service.gameReady(undefined);
      });
    });
    const newGame = {
      gametype: "test",
      playerIDs: this._clients.map((client) => client.playerID),
    };
    return this._host.startGame(newGame).then(() => {
      return messages.reduce<Promise<any>>((prev, message) => {
        return prev.then(() => this.processMessage(message));
      }, Promise.resolve());
    });
  }
}

const testRunner = new TestRunner(hostApp, clients);

testRunner.connect().then(() => {
  return testRunner.simpleGame([
    createMessage("test-msg:0"),
    createMessage("test-msg:1"),
    createMessage("test-msg:2"),
  ]).then(() => {
    console.log(`game done`);
  });
}).then(() => {
  console.log(`room done`);
});


