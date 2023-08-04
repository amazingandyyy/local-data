import { PostCard } from '../templates'
import Link from "next/link";
import {timeSince} from "@/utils";

function transformTimestamp (timestamp) {
	const days = 1000 * 60 * 60 * 24 * 365 // 365 days
	if (Date.now() - timestamp < 0) {
		return 'in ' + timeSince(timestamp)
	}
	if (Date.now() - timestamp < days) {
		return timeSince(timestamp) + ' ago'
	}
	const date = new Date(Number(timestamp))
	return date.toLocaleString('en-US', {
		year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
	})
}
export default function MeetingPost({ data }) {
	return (<PostCard>
		<div className='flex items-start justify-between pb-4'>
			<div className='flex-none w-60 md:w-96 items-start flex-col md:flex-row md:items-center'>
				<Link href={`/org/${data.id}`} className='hover:opacity-50 active:opacity-70 hover:underline'>
					<div className='font-semibold pr-1 text-base truncate ...'>{data.organizor}</div>
				</Link>
				<Link href={`/org/${data.id}`} className='hover:opacity-50 active:opacity-70'><div className='text-gray-500 text-sm'>@{data.id}</div></Link>
			</div>
			<div className='relative'>
				<div className='pl-1 text-gray-500 text-xs'>{transformTimestamp(data.timestamp)}</div>
			</div>
		</div>
		<div className='flex flex-col'>
			<div className='font-bold'>🗣️ {data.date} {data.name}</div>
			{data.agenda && <div>
				You can find the <a className='text-green-800 pt-2 inline-block' href={`${data.agenda}`} target='_blank' rel='noreferrer'>Agenda here</a>
			</div>}
			{data.agendaPacket && <div>
				<a className='text-green-800 pt-2 inline-block' href={`${data.agendaPacket}`} target='_blank' rel='noreferrer'>Agenda Packet</a> is available
			</div>}
			{data.video && <div>
				<a className='text-green-800 pt-2 inline-block' href={`${data.video}`} target='_blank' rel='noreferrer'>Video</a> is available
			</div>}
			{data.minutes && <div>
				<a className='text-green-800 pt-2 inline-block' href={`${data.minutes}`} target='_blank' rel='noreferrer'>Minutes</a> is available
			</div>}
		</div>
		<div className='flex mt-4 text-green-600 text-sm truncate ...'>
			<div className='pr-1'>#{data.id}</div>
			<div className='pr-1'>#meeting</div>
			{data.cancelled && <div className='pr-1'>#cancelled</div>}
		</div>
	</PostCard>)
}
