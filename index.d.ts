/*
 * partygame.show 1.0.0-alpha.3 (https://github.com/molisani/partygame.show-protocol) 
 * Copyright 2017 Michael Molisani
 * Licensed under LGPL-3.0 (https://github.com/molisani/partygame.show-protocol/blob/master/LICENSE)
 */
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
            playerJoined(player: Player): void;
            playerReturned(packet: Messages.ResponsePacket): void;
        }
        interface FromHost {
            startGame(room: Room): void;
            endGame(): void;
            sendPacket(packet: Messages.Packet): void;
            forceClear(): void;
        }
        interface ToClient {
            playerInfo(player: Player): void;
            loadGame(gametype: string): void;
            unloadGame(): void;
            onPacket(packet: Messages.Packet): void;
            onClear(): void;
        }
        interface FromClient {
            joinRoom(request: JoinRequest): void;
            returnResponse(packet: Messages.ResponsePacket): void;
        }
    }
    interface Listener<Events> {
        addListeners(listeners: Partial<Events>): void;
        removeListeners(listeners: Partial<Events>): void;
    }
    namespace Services {
        interface Host extends Events.FromHost, Listener<Events.ToHost> {}
        interface Client extends Events.FromClient, Listener<Events.ToClient> {}
    }
    namespace Managers {
        interface Host extends Events.ToHost, Listener<Events.FromHost> {}
        interface Client extends Events.ToClient, Listener<Events.FromClient> {}
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
