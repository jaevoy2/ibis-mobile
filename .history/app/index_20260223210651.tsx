import ResidentForm from '@/component/form';
import { residents$ as _resident$ } from '@/utils/supaSync';
import { observer } from '@legendapp/state/react';


export default function Index() {
  const Residents = observer(({ residents$ }: { residents$: typeof _resident$ }) => {
    const residents = residents$.get();

    if(residents) {
      return ( <ResidentForm /> )
    }
  })
}