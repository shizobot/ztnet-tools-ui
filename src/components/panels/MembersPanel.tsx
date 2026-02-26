import { useEffect, useState } from 'react';

import { useMembers, type MemberRecord } from '../../hooks/useMembers';

export function MembersPanel() {
  const { loadMembers } = useMembers();
  const [members, setMembers] = useState<MemberRecord[]>([]);

  useEffect(() => {
    void loadMembers().then(setMembers);
  }, [loadMembers]);

  return (
    <section>
      <h2>Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.name ?? member.id}</li>
        ))}
      </ul>
    </section>
  );
}
