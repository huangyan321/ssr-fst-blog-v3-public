import { watch, ref, nextTick, onBeforeUnmount, onBeforeUpdate } from 'vue';
import type { Ref } from 'vue';
import useSideStore from '@/store/modules/side';
import { storeToRefs } from 'pinia';
import { debounce } from '@/utils/usual';
import dirGeneratorHook from '@/hooks/dir-generator-hook';
import { onBeforeRouteUpdate } from 'vue-router';
const DEFAULT = {
  lineHeight: 20, // 每个目录子项的行高
  moreHeight: 10, //菜单左侧的线比子项多出的高度
  surplusHeight: 490, // 顶部及留白
  scrollHeight: 440, // 滚动区域高度
  delay: 100,
  toTopDistance: 30 // 文章滚动到小于等于该距离时切换活跃目录
};
interface dirGeneratorHook {
  dirBox: Ref<HTMLElement | null>; // 滚动区域元素
  dirBody: Ref<HTMLElement | null>; // 滚动列表元素
}
export default ({ dirBox, dirBody }: dirGeneratorHook) => {
  const sideStore = useSideStore();
  const { articleDir } = storeToRefs(sideStore);
  // 高亮
  const d_setHightLight = debounce(setHightLight, DEFAULT.delay);
  // 滚动目录
  const d_setScrollDirs = debounce(setScrollDirs, DEFAULT.delay);
  // 滚动区域最大可容纳目录个数
  const maxDirCount: Ref<number> = ref(0);
  // 目录高度
  const dirHeight: Ref<number> = ref(0);
  // 滚动高度
  const marginTop: Ref<number> = ref(0);
  // 文章当前目录索引
  const curActiveDirIndex = ref(0);
  // 记录滚动方向
  const scrollDirection: Ref<'up' | 'down'> = ref('down');
  // 记录滚动高度
  let lastSH = 0;
  onBeforeRouteUpdate(() => {
    removeListener();
  });
  watch(
    articleDir,
    (n) => {
      // 确保在客户端执行
      if (typeof window !== 'undefined') {
        if (!sideStore.isInList) {
          // 确保dom已经更新
          nextTick(() => {
            // 生成滚动区域可容纳目录数量&生成目录高度
            generateDirectory();
            // 安排监听器
            setListener();
          });
        } else {
          removeListener();
        }
      }
    },
    { immediate: true }
  );
  onBeforeUnmount(() => {
    removeListener();
  });
  function generateDirectory() {
    maxDirCount.value = Math.floor(DEFAULT.scrollHeight / DEFAULT.lineHeight);
    dirHeight.value =
      articleDir.value.length > maxDirCount.value
        ? maxDirCount.value * DEFAULT.lineHeight
        : articleDir.value.length * DEFAULT.lineHeight;
  }
  function setListener() {
    window.addEventListener(
      'scroll',
      // 监听页面滚动 设置高亮目录
      d_setHightLight,
      false
    );
    // 高度超过最大目录高度才可滚动
    if (articleDir.value.length > maxDirCount.value) {
      window.addEventListener(
        'scroll',
        // 监听页面滚动，按条件滚动目录
        d_setScrollDirs,
        false
      );
    }
  }
  function removeListener() {
    window.removeEventListener('scroll', d_setHightLight, false);
    window.removeEventListener('scroll', d_setScrollDirs, false);
  }
  // 性能优化 获取最近一次滚动方向
  function getScrollDirection(): 'up' | 'down' {
    let sh = window.pageYOffset,
      ret: 'up' | 'down' = 'down';
    // 当前偏移量 小于等于 上一次的偏移量
    // 向上滚动
    if (sh <= lastSH) {
      ret = 'up';
    }
    lastSH = sh;
    return ret;
  }
  // 设置高亮
  function setHightLight() {
    let scanDirIndex = 0,
      nextNode: HTMLElement;
    const articles = articleDir.value;
    // 性能优化 获取此时是向上滚动还是向下滚动
    scrollDirection.value = getScrollDirection();
    if (scrollDirection.value == 'down') {
      // 如果是向下滚动 那就设滚动前的目录索引为初始索引
      scanDirIndex = curActiveDirIndex.value;
      // 扫描距离顶部固定高度差值最小的那个目录
      while (scanDirIndex < articleDir.value.length) {
        // 拿到下一个目录节点
        let nextNode = articles[scanDirIndex + 1];
        if (!nextNode) {
          break;
        }
        nextNode = nextNode.tag;
        // 如果当前目录的下一个目录节点距离顶部小于等于固定值 那就允许这个节点索引+1 否则最近的是当前目录
        if (nextNode.getBoundingClientRect().top <= DEFAULT.toTopDistance) {
          scanDirIndex++;
        } else {
          break;
        }
      }
    } else {
      // 如果是向上滚动 那就设滚动前的目录索引为结尾索引，从0开始扫描
      while (scanDirIndex < curActiveDirIndex.value) {
        // 拿到下一个目录节点
        let nextNode = articles[scanDirIndex];
        if (!nextNode) {
          break;
        }
        nextNode = nextNode.tag;
        // 如果当前目录的下一个目录节点距离顶部小于等于固定值 那就允许这个节点索引+1 否则最近的是当前目录
        if (nextNode.getBoundingClientRect().top <= DEFAULT.toTopDistance) {
          scanDirIndex++;
        } else {
          break;
        }
      }
    }
    curActiveDirIndex.value =
      scanDirIndex === articles.length ? scanDirIndex - 1 : scanDirIndex;
  }
  // 按条件滚动目录
  function setScrollDirs() {
    const ulEl = dirBody.value;
    const ulElBCR = (ulEl as HTMLElement).getBoundingClientRect();
    // 目录容器顶部与视口顶部的距离
    const ulBCRTop = ulElBCR.top;
    // 目录容器底部与视口顶部的距离
    const ulBCRBottom = ulElBCR.bottom;
    const dirBoxElBCR = (dirBox.value as HTMLElement).getBoundingClientRect();
    // 滚动容器顶部与视口顶部的距离
    const dirBoxBCRTop = dirBoxElBCR.top;
    // 滚动容器底部与视口顶部的距离
    const dirBoxBCRBottom = dirBoxElBCR.bottom;
    // 获取当前的活跃目录节点元素
    const curActiveDirEl = document.querySelector('.dirBox__active');
    const curActiveDirBCR = (
      curActiveDirEl as HTMLElement
    ).getBoundingClientRect();
    // 当前活跃目录顶部到视口顶部的距离
    const curActiveDirTop = curActiveDirBCR.top;
    // 当前活跃目录底部到视口顶部的距离
    const curActiveDirBottom = curActiveDirBCR.bottom;
    // 滚动容器的滚动高度
    const dirBoxScrollTop = (dirBox.value as HTMLElement).scrollTop;
    // 中间线到body顶部的距离 中间线取滚动容器可容纳目录个数的一半
    const middleLine =
      dirBoxBCRTop +
      (Math.floor(DEFAULT.scrollHeight / DEFAULT.lineHeight) *
        DEFAULT.lineHeight) /
        2;
    if (scrollDirection.value == 'down') {
      // 向下滚动
      /**
       * 不滚动条件(中间线上半部分)： 当前活跃目录顶部到滚动目录顶部的距离小于中线减去滚动容器滚动高度后到滚动目录的距离
       * 滚动条件： 当前 活跃目录顶部 到 中间线减去滚动容器滚动高度 后的距离 小于 目录容器底部 到 滚动容器底部 的距离
       * 不滚动条件： 当大于的时候就不能滚动了
       */
      if (
        curActiveDirTop - dirBoxBCRTop <
        middleLine - dirBoxScrollTop - dirBoxBCRTop
      ) {
        // 此时活跃目录节点位于中间线上方 不滚动
      } else if (
        dirBoxScrollTop === -marginTop.value &&
        curActiveDirTop - middleLine < ulBCRBottom - dirBoxBCRBottom
      ) {
        // 此时活跃目录节点位于中间线下方 只有此节点到中线的距离比ul的底部到滚动容器底部的距离小才能滚动
        marginTop.value -=
          Math.floor(
            (curActiveDirBCR.bottom - middleLine) / DEFAULT.lineHeight
          ) * DEFAULT.lineHeight;
      } else if (
        dirBoxScrollTop !== -marginTop.value &&
        curActiveDirTop - middleLine + dirBoxScrollTop <
          ulBCRBottom - dirBoxBCRTop
      ) {
        marginTop.value -=
          Math.floor(
            (curActiveDirBCR.bottom - middleLine + dirBoxScrollTop) /
              DEFAULT.lineHeight
          ) * DEFAULT.lineHeight;
      } else {
        // 剩下偏移的距离
        // 如果直接滚动到底部 没有一个累加的过程，那就直接给他赋值
        if (!marginTop.value) {
          marginTop.value = -ulBCRBottom;
        } else {
          marginTop.value -= ulBCRBottom - dirBoxBCRBottom;
        }
      }
    } else {
      // 向上滚动
      const scrollHeight = -marginTop.value - dirBoxScrollTop;
      if (
        dirBoxBCRBottom - curActiveDirBottom <
        dirBoxBCRBottom - middleLine - scrollHeight
      ) {
        // 不需要滚动
      } else if (
        dirBoxScrollTop === -marginTop.value &&
        dirBoxBCRTop - ulBCRTop > middleLine - curActiveDirTop
      ) {
        // 此时活跃目录节点位于中间线下方 只有此节点到中线的距离比ul的底部到滚动容器底部的距离小才能滚动
        marginTop.value +=
          Math.floor((middleLine - curActiveDirBCR.top) / DEFAULT.lineHeight) *
          DEFAULT.lineHeight;
      } else if (
        dirBoxScrollTop !== -marginTop.value &&
        dirBoxBCRTop - ulBCRTop > middleLine - curActiveDirTop - scrollHeight
      ) {
        marginTop.value +=
          Math.floor(
            (middleLine - curActiveDirTop + scrollHeight) / DEFAULT.lineHeight
          ) * DEFAULT.lineHeight;
      } else {
        marginTop.value = 0;
      }
    }
    // 使用位移
    // (ulEl as HTMLElement).style.transform = `translateY(${marginTop.value}px)`;
    // 使用滚动
    (dirBox.value as HTMLElement).scrollTop = -marginTop.value;
  }
  function dirClick(e: MouseEvent, index: number) {
    e.preventDefault();
    const curTopArticle = articleDir.value[index];
    if (curTopArticle) {
      const curTopArticleEl: HTMLElement = curTopArticle.tag;
      const curTopArticleElBCR = curTopArticleEl.getBoundingClientRect();
      let curTop = curTopArticleElBCR.top;
      scrollArticleToActive(
        curTop + window.pageYOffset - DEFAULT.toTopDistance,
        300
      );
    }
  }
  function scrollArticleToActive(scrollTop: number, duration: number) {
    let startTime: number;
    let currScrollTop = window.pageYOffset;
    function step(timestamp: number) {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = Math.round(timestamp - startTime);
      const distance =
        elapsed * ((Math.round(scrollTop) - currScrollTop) / duration) +
        currScrollTop;

      document.documentElement.scrollTop = document.body.scrollTop = distance;

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }
  return {
    dirHeight,
    curActiveDirIndex,
    lineHeight: DEFAULT.lineHeight,
    dirClick
  };
};
