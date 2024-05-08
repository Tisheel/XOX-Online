import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const Game = () => {

    const [ws, setWs] = useState(null)

    const [players, setPlayers] = useState([])
    const [board, setBoard] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [turn, setTurn] = useState(0)

    const [winner, setWinner] = useState(null)

    const { id } = useParams()
    const query = new URLSearchParams(useLocation().search)

    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:6969')
        setWs(ws)
        ws.onopen = (e) => {
            ws.send(JSON.stringify({
                type: 'JOIN_ROOM',
                data: {
                    roomId: id,
                    name: query.get('name')
                }
            }))
            ws.onmessage = (e) => {
                const { type, data } = JSON.parse(e.data)
                switch (type) {
                    case 'ROOM_JOIN': {
                        setPlayers(data)
                        if (players.length === 2) {
                            ws.send(JSON.stringify({
                                type: 'START_GAME'
                            }))
                        }
                        break
                    }
                    case 'GAME_STATE': {
                        setTurn(data.turn)
                        setBoard(data.board)
                        break
                    }
                    case 'ILLEGAL_MOVE': {
                        alert('Illegal Move!!!')
                        break
                    }
                    case 'WINNER': {
                        setWinner(data)
                        break
                    }
                    default:
                        break
                }
            }
        }
    }, [])

    const handleMove = (position) => {
        ws.send(JSON.stringify({
            type: 'MOVE',
            data: position
        }))
    }

    return (
        <section className='flex flex-col justify-center items-center gap-24 font-mono'>
            <section id="footer">
                <h1>Tic Tac Toe</h1>
            </section>
            <section className='flex flex-col justify-center gap-3'>
                {
                    players.length < 2 ? <>
                        <span className='underline cursor-pointer' onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + `?roomId=${id}`)
                            alert('Copied!!!')
                        }}>Invite</span>
                        <span className='text-center'>waiting for players to join...</span>
                    </>
                        :
                        <>
                            <section className='flex justify-center items-center'>
                                {
                                    winner ? <span>Winner is {winner}🎉</span>
                                        :
                                        <span>Turn: <span></span>{players[turn - 1]}</span>
                                }
                            </section>
                            <section className='grid grid-cols-3'>
                                {
                                    board.map((node, index) => {
                                        return <div className="w-24 h-24 cursor-pointer border text-4xl font-bold flex justify-center items-center" type="button" onClick={() => handleMove(index)}>
                                            {
                                                node === 1 && '❌' || node === 2 && '⭕'
                                            }
                                        </div>
                                    })
                                }
                            </section>
                            <table>
                                <tr>
                                    <th>
                                        Players
                                    </th>
                                    {
                                        players.map((player) => {
                                            return <th key={player}>{player}</th>
                                        })
                                    }
                                </tr>
                            </table>
                        </>
                }
            </section>
            <section>
                <span>made by </span>
                <a href="https://www.linkedin.com/in/tisheel-bashyam/" target="_blank">tisheel</a>
                <span> -ik my UI is 💩</span>
            </section>
        </section>
    )
}

export default Game