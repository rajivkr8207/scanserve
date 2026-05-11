'use client';

import React from 'react';
import { MenuTemplate } from '@shared/types/restaurant.type';
import type { IRestaurant } from '@shared/types/restaurant.type';
import type { IMenuItem } from '@shared/types/menu.type';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import MinimalTemplate from './MinimalTemplate';
import VibrantTemplate from './VibrantTemplate';

interface TemplateSwitcherProps {
  restaurant: IRestaurant;
  menu: any[];
}

const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({ restaurant, menu }) => {
  switch (restaurant.menuTemplate) {
    case MenuTemplate.MODERN:
      return <ModernTemplate restaurant={restaurant} menu={menu} />;
    case MenuTemplate.CLASSIC:
      return <ClassicTemplate restaurant={restaurant} menu={menu} />;
    case MenuTemplate.MINIMAL:
      return <MinimalTemplate restaurant={restaurant} menu={menu} />;
    case MenuTemplate.VIBRANT:
      return <VibrantTemplate restaurant={restaurant} menu={menu} />;
    default:
      return <ModernTemplate restaurant={restaurant} menu={menu} />;
  }
};

export default TemplateSwitcher;
