with open('frontend/src/components/common/Header.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.startswith('<<<<<<< HEAD'):
        # Skip the conflict header and the partial telemetry pill from HEAD
        skip = True
        continue
    elif line.startswith('======='):
        skip = False
        continue
    elif line.startswith('>>>>>>> f66d4ed'):
        # Close the switcher if needed and insert telemetry pill properly
        new_lines.append('          </div>\n')
        new_lines.append('        )}\n\n')
        new_lines.append('        {/* Live Fleet Telemetry Pill */}\n')
        new_lines.append('        <div\n')
        new_lines.append('          className="driver-trip-telemetry-pill fleet-telemetry-pill"\n')
        new_lines.append('          onClick={() => onSelectTab && onSelectTab(\'vehicles\')}\n')
        new_lines.append('          title="Click to view Fleet Assets"\n')
        new_lines.append('          style={{ background: \'#EFF6FF\', borderColor: \'#BFDBFE\' }}\n')
        new_lines.append('        >\n')
        new_lines.append('          <div className="pill-icon-circle" style={{ background: \'#DBEAFE\' }}>\n')
        new_lines.append('            <Truck size={13} color="#2563EB" strokeWidth={2.5} />\n')
        new_lines.append('          </div>\n')
        continue
    
    if not skip:
        new_lines.append(line)

with open('frontend/src/components/common/Header.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed Header.jsx conflict successfully!")
