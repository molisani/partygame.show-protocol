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
    }
    interface JoinRequest {
        lobbyCode: string;
        displayName: string;
        uid?: string;
    }
    interface Player {
        uid: string;
        displayName: string;
        color: string;
    }
    interface PlayerMap<T> {
        [uid: string]: T;
    }
    interface Room {
        gametype: string;
        players: Player[];
    }
    interface PlayerScoreEntry {
        score: number;
    }
    namespace Messages {
        interface Payload {
            type: string;
        }
        interface Packet {
            msgId: string;
            recipients: string[];
            payload: Payload;
            expiresAfter: number;
            notify: boolean;
        }
        interface ResponsePayload extends Payload {
            author: string;
        }
        interface ResponsePacket {
            msgId: string;
            player: Player;
            response: ResponsePayload;
        }
    }
    namespace Events {
        interface ToHost {
            playerJoined: Player;
            playerReturned: Messages.ResponsePacket;
        }
        interface FromHost {
            startGame: Room;
            endGame: void;
            sendPacket: Messages.Packet;
            forceClear: void;
        }
        interface ToClient {
            playerInfo: Player;
            loadGame: string;
            unloadGame: void;
            onPacket: Messages.Packet;
            onClear: void;
        }
        interface FromClient {
            joinRoom: JoinRequest;
            returnResponse: Messages.ResponsePacket;
        }
    }
    namespace Actions {
        interface ToHost {
            playerJoined(player: Player): void;
            playerReturned(packet: Messages.ResponsePacket): void;
        }
        interface FromHost {
            startGame(room: Room): void;
            endGame(_: void): void;
            sendPacket(packet: Messages.Packet): void;
            forceClear(_: void): void;
        }
        interface ToClient {
            playerInfo(player: Player): void;
            loadGame(gametype: string): void;
            unloadGame(_: void): void;
            onPacket(packet: Messages.Packet): void;
            onClear(_: void): void;
        }
        interface FromClient {
            joinRoom(request: JoinRequest): void;
            returnResponse(packet: Messages.ResponsePacket): void;
        }
    }
    interface Listener<Events> {
        addListeners(listeners: { [E in keyof Events]: (data: Events[E]) => void }): void;
        removeListeners(listeners: { [E in keyof Events]: (data: Events[E]) => void }): void;
    }
    namespace Services {
        interface Host extends Actions.FromHost, Listener<Events.ToHost> {}
        interface Client extends Actions.FromClient, Listener<Events.ToClient> {}
    }
    namespace Managers {
        interface Host extends Actions.ToHost, Listener<Events.FromHost> {}
        interface Client extends Actions.ToClient, Listener<Events.FromClient> {}
    }
    namespace View {
        interface Host {
            startGame(host: Services.Host, players: Player[]): Promise<PlayerMap<PlayerScoreEntry>>;
        }
        interface ClientRequestHandler<P extends Messages.Payload> {
            handle(self: Player, payload: P): Promise<Messages.ResponsePayload>;
        }
        interface Client {
            getHandler(msgType: string): ClientRequestHandler<Messages.Payload>;
        }
    }
}
