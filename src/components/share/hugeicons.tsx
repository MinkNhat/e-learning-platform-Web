import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
    Add01Icon,
    ApiIcon,
    AppStoreIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Award01Icon,
    BookOpenIcon,
    BulbIcon,
    Calendar01Icon,
    Certificate01Icon,
    CheckmarkCircle02Icon,
    CheckmarkSquare01Icon,
    Clock01Icon,
    CodeIcon,
    CompassIcon,
    ComputerIcon,
    DatabaseIcon,
    Delete02Icon,
    EyeIcon,
    File01Icon,
    FilterIcon,
    FireIcon,
    GlobalIcon,
    HtmlFiveIcon,
    LaptopIcon,
    Logout01Icon,
    Menu01Icon,
    MobileNavigator01Icon,
    MoreHorizontalIcon,
    NodeAddIcon,
    PencilEdit02Icon,
    PlayCircleIcon,
    RocketIcon,
    Sad01Icon,
    Search01Icon,
    SketchIcon,
    Sorting01Icon,
    StarIcon,
    TagsIcon,
    ThirdBracketCircleIcon as ThirdBracketCircleGlyph,
    Upload01Icon,
    UserAdd01Icon,
    UserIcon,
    UserMultipleIcon,
} from '@hugeicons/core-free-icons';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

type IconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'strokeWidth'> & {
    size?: string | number;
    spin?: boolean;
    strokeWidth?: number;
};

const createIcon = (icon: IconSvgElement) => forwardRef<SVGSVGElement, IconProps>(
    ({ size = '1em', strokeWidth = 1.8, style, spin: _spin, ...props }, ref) => (
        <HugeiconsIcon
            ref={ref}
            icon={icon}
            size={size}
            strokeWidth={strokeWidth}
            style={{ verticalAlign: '-0.125em', ...style }}
            {...props}
        />
    ),
);

export const AddIcon = createIcon(Add01Icon);
export const ApiIconStroke = createIcon(ApiIcon);
export const AppstoreIcon = createIcon(AppStoreIcon);
export const ArrowLeftIcon = createIcon(ArrowLeft01Icon);
export const ArrowRightIcon = createIcon(ArrowRight01Icon);
export const AwardIcon = createIcon(Award01Icon);
export const BookIcon = createIcon(BookOpenIcon);
export const BulbIconStroke = createIcon(BulbIcon);
export const CalendarIcon = createIcon(Calendar01Icon);
export const CertificateIcon = createIcon(Certificate01Icon);
export const CheckCircleIcon = createIcon(CheckmarkCircle02Icon);
export const CheckSquareIcon = createIcon(CheckmarkSquare01Icon);
export const ClockIcon = createIcon(Clock01Icon);
export const CodeIconStroke = createIcon(CodeIcon);
export const CompassIconStroke = createIcon(CompassIcon);
export const ComputerIconStroke = createIcon(ComputerIcon);
export const DatabaseIconStroke = createIcon(DatabaseIcon);
export const DeleteIcon = createIcon(Delete02Icon);
export const EyeIconStroke = createIcon(EyeIcon);
export const FileIcon = createIcon(File01Icon);
export const FilterIconStroke = createIcon(FilterIcon);
export const FireIconStroke = createIcon(FireIcon);
export const GlobalIconStroke = createIcon(GlobalIcon);
export const HtmlIcon = createIcon(HtmlFiveIcon);
export const LaptopIconStroke = createIcon(LaptopIcon);
export const LogoutIcon = createIcon(Logout01Icon);
export const MenuIcon = createIcon(Menu01Icon);
export const MobileIcon = createIcon(MobileNavigator01Icon);
export const MoreIcon = createIcon(MoreHorizontalIcon);
export const NodeIcon = createIcon(NodeAddIcon);
export const EditIcon = createIcon(PencilEdit02Icon);
export const PlayIcon = createIcon(PlayCircleIcon);
export const RocketIconStroke = createIcon(RocketIcon);
export const SadIcon = createIcon(Sad01Icon);
export const SearchIcon = createIcon(Search01Icon);
export const SketchIconStroke = createIcon(SketchIcon);
export const SortIcon = createIcon(Sorting01Icon);
export const StarIconStroke = createIcon(StarIcon);
export const TagsIconStroke = createIcon(TagsIcon);
export const ThirdBracketCircleIcon = createIcon(ThirdBracketCircleGlyph);
export const UploadIcon = createIcon(Upload01Icon);
export const UserAddIcon = createIcon(UserAdd01Icon);
export const UserIconStroke = createIcon(UserIcon);
export const UsersIcon = createIcon(UserMultipleIcon);
