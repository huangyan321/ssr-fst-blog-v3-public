import { ref, onMounted, nextTick } from 'vue';
import type { Ref } from 'vue';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import ObserveDOM from '@better-scroll/observe-dom';
import ObserveImage from '@better-scroll/observe-image';
import ScrollBar from '@better-scroll/scroll-bar';
import { IsPC } from '@/utils/usual';
import useListStore from '@/store/modules/list';
BScroll.use(ScrollBar);
// BScroll.use(PullDown);
BScroll.use(ObserveDOM);
BScroll.use(ObserveImage);
export default (cb?: () => Promise<any>) => {
  let bs: BScroll | null = null;
  const listHeight = ref(0);
  const listRef: Ref<HTMLElement | null> = ref(null);
  const beforePullDown = ref(true);
  const isPullingDown = ref(false);
  const listStore = useListStore();
  const initBScroll = () => {
    if (!listRef.value || IsPC()) {
      return (bs = null);
    }
    bs = new BScroll(listRef.value as unknown as HTMLElement, {
      scrollY: true,
      observeDOM: true,
      bounceTime: 600,
      swipeBounceTime: 300,
      useTransition: true,
      pullDownRefresh: true,
      // 硬件加速
      HWCompositing: true,
      observeImage: true, // 开启 observe-image 插件
      scrollbar: true,
      deceleration: 0.004,
      outOfBoundaryDampingFactor: 1 / 8,
      preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|A|UL|LI|I|SPAN)$/
      }
    });
    listStore.BScrollInstance = bs;
    // bs.on('pullingDown', pullingDownHandler);
    bs.on('scroll', scrollHandler);
  };
  // const pullingDownHandler = () => {
  //   beforePullDown.value = false;
  //   isPullingDown.value = true;
  //   setTimeout(async () => {
  //     await cb?.();
  //     isPullingDown.value = false;
  //     finishPullDown();
  //   }, 800);
  // };
  // const finishPullDown = () => {
  //   bs && bs.finishPullDown();
  //   setTimeout(() => {
  //     beforePullDown.value = true;
  //     bs && bs.refresh();
  //   }, 1000);
  // };
  const scrollHandler = (pos: any) => {
    // console.log(pos.y);
  };
  onMounted(() => {
    const htmlHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    listHeight.value = htmlHeight - 60;
    nextTick(() => {
      initBScroll();
    });
  });
  return {
    listRef,
    listHeight,
    beforePullDown,
    isPullingDown,
    bs
  };
};
