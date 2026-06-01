export type SidebarSlot = {
  id: string;
  title: string;
  enabled: boolean;
  url: string;
  image: string;
  type: 'normal' | 'long';
};

export const DEFAULT_SIDEBARS: SidebarSlot[] = [
  { id: 'n1', title: 'Sidebar Normal 1', enabled: true, url: '', image: 'https://images.pexels.com/photos/7873559/pexels-photo-7873559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=260&w=720', type: 'normal' },
  { id: 'n2', title: 'Sidebar Normal 2', enabled: true, url: 'https://integritypost.co', image: 'https://images.pexels.com/photos/8370345/pexels-photo-8370345.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=260&w=720', type: 'normal' },
  { id: 'n3', title: 'Sidebar Normal 3', enabled: false, url: '', image: '', type: 'normal' },
  { id: 'n4', title: 'Sidebar Normal 4', enabled: false, url: '', image: '', type: 'normal' },
  { id: 'l1', title: 'Sidebar Panjang 1', enabled: true, url: 'https://integritypost.co/kontak', image: 'https://images.pexels.com/photos/15652229/pexels-photo-15652229.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', type: 'long' },
  { id: 'l2', title: 'Sidebar Panjang 2', enabled: true, url: '', image: 'https://images.pexels.com/photos/15351396/pexels-photo-15351396.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', type: 'long' },
  { id: 'l3', title: 'Sidebar Panjang 3', enabled: true, url: 'https://integritypost.co', image: 'https://images.pexels.com/photos/20313664/pexels-photo-20313664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', type: 'long' },
  { id: 'l4', title: 'Sidebar Panjang 4', enabled: true, url: '', image: 'https://images.pexels.com/photos/20254633/pexels-photo-20254633.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', type: 'long' },
];
