import { 
  User, 
  FileText, 
  Stethoscope, 
  History, 
  Heart, 
  Coffee, 
  Users, 
  Search, 
  Camera, 
  Info 
} from "lucide-react";

interface Section {
  id: string;
  label: string;
}

interface AnamneseNavProps {
  sections: Section[];
  currentSection: number;
  onSectionClick: (index: number) => void;
}

const icons = [
  User,
  FileText,
  Stethoscope,
  History,
  Heart,
  Coffee,
  Users,
  Search,
  Camera,
  Info,
];

const AnamneseNav = ({ sections, currentSection, onSectionClick }: AnamneseNavProps) => {
  return (
    <nav className="bg-card rounded-xl shadow-card p-4 border">
      <h3 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
        Navegação
      </h3>
      <ul className="space-y-2">
        {sections.map((section, index) => {
          const Icon = icons[index];
          const isActive = currentSection === index;
          const isCompleted = currentSection > index;

          return (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(index)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                  transition-smooth text-left
                  ${
                    isActive
                      ? "gradient-primary text-white shadow-md"
                      : isCompleted
                      ? "bg-accent/10 text-accent hover:bg-accent/20"
                      : "hover:bg-muted"
                  }
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm">{section.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AnamneseNav;
