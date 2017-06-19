declare namespace PartyGameShow {
  namespace Game {
    interface Metadata {
      active: boolean;
      title: string;
      subtitle: string;
      version: string;
      minPlayers: number;
      maxPlayers?: number;
    }
    interface Loader {
      gametype: string;
      metadata: Metadata;
    }
    interface ContentPack {
      packID: string;
      data: object;
    }
    interface Content {
      base: ContentPack;
      extra: ContentPack[];
    }
  }
  interface Room {
    roomID?: string;
    lobbyCode: string;
  }
  interface Player {
    playerID: string;
    displayName: string;
    color: string;
  }
  namespace Requests {
    interface JoinRoom {
      playerID: string;
      lobbyCode: string;
    }
    interface NewGame {
      gametype: string;
      playerIDs: string[];
    }
  }
  namespace Responses {
    interface AvailableGames {
      games: Game.Loader[];
    }
    interface LoadGame extends Requests.NewGame {
      reload: boolean;
    }
  }
  interface PlayerMap<T> {
    [playerID: string]: T;
  }
  interface PlayerScoreEntry {
    score: number;
  }
  namespace Messages {
    interface Payload {
      type: string;
    }
    interface Packet {
      msgID: string;
      recipientIDs: string[];
      payload: Payload;
      expiresAfter: number;
      notify: boolean;
    }
    interface ResponsePayload extends Payload {
      authorID: string;
    }
    interface ResponsePacket {
      msgID: string;
      playerID: string;
      response: ResponsePayload;
    }
  }
  namespace Events {
    interface ToHost {
      availableGames: Responses.AvailableGames;
      onRoom: Room;
      gameContent: Game.Content;
      playerJoined: Player;
      playerUpdated: Player;
      playerReady: Player;
      playerReturned: Messages.ResponsePacket;
      onError: object;
    }
    interface FromHost {
      listGames: void;
      startRoom: void;
      endRoom: void;
      startGame: Requests.NewGame;
      endGame: void;
      sendPacket: Messages.Packet;
      forceClear: void;
    }
    interface ToClient {
      playerInfo: Player;
      joinedRoom: Room;
      loadGame: Responses.LoadGame;
      unloadGame: void;
      onPacket: Messages.Packet;
      onClear: void;
      onError: object;
    }
    interface FromClient {
      getPlayerInfo: void;
      updatePlayerInfo: Partial<Player>;
      joinRoom: Requests.JoinRoom;
      gameReady: void;
      returnResponse: Messages.ResponsePacket;
    }
  }
  namespace Signals {
    interface ToHost {
      availableGames(games: Responses.AvailableGames): void;
      onRoom(room: Room): void;
      gameContent(content: Game.Content): void;
      playerJoined(player: Player): void;
      playerUpdated(player: Player): void;
      playerReady(player: Player): void;
      playerReturned(packet: Messages.ResponsePacket): void;
      onError(err: object): void;
    }
    interface FromHost {
      listGames(_: void): void;
      startRoom(_: void): void;
      endRoom(_: void): void;
      startGame(game: Requests.NewGame): void;
      endGame(_: void): void;
      sendPacket(packet: Messages.Packet): void;
      forceClear(_: void): void;
    }
    interface ToClient {
      playerInfo(player: Player): void;
      joinedRoom(room: Room): void;
      loadGame(game: Responses.LoadGame): void;
      unloadGame(_: void): void;
      onPacket(packet: Messages.Packet): void;
      onClear(_: void): void;
      onError(err: object): void;
    }
    interface FromClient {
      getPlayerInfo(_: void): void;
      updatePlayerInfo(request: Partial<Player>): void;
      joinRoom(request: Requests.JoinRoom): void;
      gameReady(_: void): void;
      returnResponse(packet: Messages.ResponsePacket): void;
    }
  }
  interface Listener<Events> {
    addListener<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void;
    addOneTimeListener<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void;
    removeListener<E extends keyof Events>(event: E, listener: (data: Events[E]) => void): void;
    addListeners(listeners: {[E in keyof Events]?: (data: Events[E]) => void }): void;
    removeListeners(listeners: {[E in keyof Events]?: (data: Events[E]) => void }): void;
  }
  namespace Services {
    interface Host extends Signals.FromHost, Listener<Events.ToHost> { }
    interface Client extends Signals.FromClient, Listener<Events.ToClient> { }
  }
  namespace Managers {
    interface Host extends Signals.ToHost, Listener<Events.FromHost> { }
    interface Client extends Signals.ToClient, Listener<Events.FromClient> { }
  }
  interface Server extends Signals.FromHost {
    clientConnected(client: Managers.Client);
  }
  namespace Views {
    interface GameHost {
      start(host: Services.Host, players: Player[]): Promise<PlayerMap<PlayerScoreEntry>>;
    }
    interface GameClientRequestHandler<P extends Messages.Payload> {
      handle(self: Player, payload: P): Promise<Messages.ResponsePayload>;
    }
    interface GameClient {
      getHandler(payloadType: string): GameClientRequestHandler<Messages.Payload>;
    }
  }
}
