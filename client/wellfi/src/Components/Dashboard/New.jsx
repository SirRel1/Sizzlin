import React, {useState } from 'react'

export default function New() {
    const [ name, setName ] = useState('Cayla is logged in');
  return (
    <div>This is a new page for {name} </div>
  )
}


